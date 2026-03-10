'use client';

/**
 * SSEProvider — centralized Server-Sent Events connection for CareConnect.
 *
 * Responsibilities:
 * - Opens a single persistent EventSource to GET /sse when the user is logged in.
 * - Closes + cleans up on logout or unmount.
 * - Routes incoming events to registered component-level callbacks.
 *
 * Design principles:
 * - Completely decoupled from individual features. Components declare what
 *   events they care about via useSSE().subscribe(); they do not manage the
 *   transport themselves.
 * - Does NOT replace socket.io — chat (bi-directional) still uses SocketProvider.
 *   SSE handles all server→client data change events (bookings, assignments, etc.).
 * - Reconnects automatically: EventSource handles reconnection natively.
 *   We implement exponential back-off on top for rate-limited environments.
 */

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Standardized payload every SSE event carries. Mirrors backend SseEvent. */
export interface ServerEvent<T = any> {
    type: string;
    data: T;
    timestamp: string;
}

/** All known event type strings. Keep in sync with backend SSE_EVENTS. */
export const SSE_EVENT_TYPES = {
    NOTIFICATION: 'notification',

    BOOKING_CREATED: 'booking:created',
    BOOKING_UPDATED: 'booking:updated',
    BOOKING_STARTED: 'booking:started',
    BOOKING_COMPLETED: 'booking:completed',
    BOOKING_CANCELLED: 'booking:cancelled',
    BOOKING_RESCHEDULED: 'booking:rescheduled',

    ASSIGNMENT_CREATED: 'assignment:created',
    ASSIGNMENT_ACCEPTED: 'assignment:accepted',
    ASSIGNMENT_REJECTED: 'assignment:rejected',

    REQUEST_CREATED: 'request:created',
    REQUEST_MATCHED: 'request:matched',
    REQUEST_CANCELLED: 'request:cancelled',
} as const;

export type SSEEventType = (typeof SSE_EVENT_TYPES)[keyof typeof SSE_EVENT_TYPES];

type EventCallback<T = any> = (data: T) => void;

interface SSEContextType {
    /**
     * Subscribe to a specific event type.
     * Returns an unsubscribe function — call it in useEffect cleanup.
     *
     * @example
     * useEffect(() => {
     *   return subscribe(SSE_EVENT_TYPES.BOOKING_UPDATED, (data) => {
     *     setBookings(prev => prev.map(b => b.id === data.id ? data : b));
     *   });
     * }, [subscribe]);
     */
    subscribe: <T = any>(
        eventType: string,
        callback: EventCallback<T>
    ) => () => void;

    /** Whether the SSE connection is currently open. */
    connected: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SSEContext = createContext<SSEContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SSEProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { addToast } = useToast();

    const eventSourceRef = useRef<EventSource | null>(null);
    const listenersRef = useRef<Map<string, Set<EventCallback>>>(new Map());
    const connectedRef = useRef(false);
    const [connected, setConnected] = React.useState(false);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectAttemptsRef = useRef(0);

    // ── Internal: dispatch incoming events to registered callbacks ──────────────
    const dispatch = useCallback((event: ServerEvent) => {
        const callbacks = listenersRef.current.get(event.type);
        if (callbacks) {
            callbacks.forEach((cb) => {
                try {
                    cb(event.data);
                } catch (err) {
                    console.error(`[SSE] Error in callback for event "${event.type}":`, err);
                }
            });
        }
    }, []);

    // ── Internal: create and wire EventSource ────────────────────────────────────
    const connect = useCallback(() => {
        if (!user) return;

        // EventSource does not support custom headers, so we rely on cookie-based auth.
        // NestJS AuthGuard('jwt') reads the access_token cookie automatically.
        const es = new EventSource(`${API_URL}/sse`, {
            withCredentials: true,
        });

        eventSourceRef.current = es;

        es.onopen = () => {
            console.log('[SSE] Connection established');
            connectedRef.current = true;
            setConnected(true);
            reconnectAttemptsRef.current = 0; // Reset backoff on successful connect
        };

        es.onmessage = (rawEvent) => {
            try {
                const payload: ServerEvent = JSON.parse(rawEvent.data);
                console.debug('[SSE] Event received:', payload.type, payload.data);
                dispatch(payload);
            } catch (err) {
                console.error('[SSE] Failed to parse event:', rawEvent.data, err);
            }
        };

        es.onerror = (err) => {
            console.warn('[SSE] Connection error — will attempt to reconnect', err);
            connectedRef.current = false;
            setConnected(false);
            es.close();
            eventSourceRef.current = null;

            // Exponential back-off: 1s, 2s, 4s, 8s, max 30s
            const delay = Math.min(
                1000 * Math.pow(2, reconnectAttemptsRef.current),
                30_000
            );
            reconnectAttemptsRef.current += 1;

            reconnectTimerRef.current = setTimeout(() => {
                if (user) connect(); // Only reconnect if still logged in
            }, delay);
        };
    }, [user, dispatch]);

    // ── Lifecycle: connect when user logs in, disconnect on logout/unmount ───────
    useEffect(() => {
        if (!user) {
            // User logged out — tear down
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            connectedRef.current = false;
            setConnected(false);
            reconnectAttemptsRef.current = 0;
            return;
        }

        connect();

        return () => {
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
    }, [user, connect]);

    // ── Public API: subscribe ─────────────────────────────────────────────────────
    const subscribe = useCallback(<T = any>(
        eventType: string,
        callback: EventCallback<T>
    ): (() => void) => {
        if (!listenersRef.current.has(eventType)) {
            listenersRef.current.set(eventType, new Set());
        }
        listenersRef.current.get(eventType)!.add(callback as EventCallback);

        // Return unsubscribe function
        return () => {
            listenersRef.current.get(eventType)?.delete(callback as EventCallback);
        };
    }, []);

    const value = React.useMemo(
        () => ({ subscribe, connected }),
        [subscribe, connected]
    );

    return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSSE(): SSEContextType {
    const ctx = useContext(SSEContext);
    if (!ctx) throw new Error('useSSE must be used within <SSEProvider>');
    return ctx;
}
