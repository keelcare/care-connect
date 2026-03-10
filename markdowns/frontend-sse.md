# Frontend SSE — Integration Guide

## Overview

CareConnect uses **Server-Sent Events** (SSE) for all server→client real-time data change notifications. The `SSEProvider` manages a single persistent `EventSource` connection per logged-in user. Individual components subscribe to the event types they care about via `useSSE()`.

**Socket.io is still used exclusively for Chat** (bi-directional messaging). Do not use `useSocket()` for data refresh — use `useSSE()` instead.

---

## Key Files

| File | Role |
|------|------|
| `src/context/SSEProvider.tsx` | EventSource lifecycle, pub/sub registry, `useSSE()` hook |
| `src/app/layout.tsx` | Mounts `<SSEProvider>` globally for all pages |
| `src/app/parent-dashboard/page.tsx` | Example: parent subscribes to booking+request events |
| `src/app/dashboard/page.tsx` | Example: nanny subscribes to booking+assignment events |

---

## Event Type Constants

```typescript
import { SSE_EVENT_TYPES } from '@/context/SSEProvider';

SSE_EVENT_TYPES.NOTIFICATION        // 'notification'
SSE_EVENT_TYPES.BOOKING_CREATED     // 'booking:created'
SSE_EVENT_TYPES.BOOKING_UPDATED     // 'booking:updated'
SSE_EVENT_TYPES.BOOKING_STARTED     // 'booking:started'
SSE_EVENT_TYPES.BOOKING_COMPLETED   // 'booking:completed'
SSE_EVENT_TYPES.BOOKING_CANCELLED   // 'booking:cancelled'
SSE_EVENT_TYPES.BOOKING_RESCHEDULED // 'booking:rescheduled'
SSE_EVENT_TYPES.ASSIGNMENT_CREATED  // 'assignment:created'
SSE_EVENT_TYPES.ASSIGNMENT_ACCEPTED // 'assignment:accepted'
SSE_EVENT_TYPES.ASSIGNMENT_REJECTED // 'assignment:rejected'
SSE_EVENT_TYPES.REQUEST_CREATED     // 'request:created'
SSE_EVENT_TYPES.REQUEST_MATCHED     // 'request:matched'
SSE_EVENT_TYPES.REQUEST_CANCELLED   // 'request:cancelled'
```

---

## How to Wire a Component

```tsx
'use client';

import { useEffect, useCallback } from 'react';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';

export function MyComponent() {
  const { subscribe } = useSSE();

  const refetch = useCallback(async () => {
    // call your API here
  }, []);

  useEffect(() => {
    // subscribe() returns an unsubscribe function —
    // return it from useEffect to clean up on unmount.
    const unsub = subscribe(SSE_EVENT_TYPES.BOOKING_UPDATED, (data) => {
      console.log('Booking updated:', data);
      refetch();
    });

    return unsub;
  }, [subscribe, refetch]);

  // ...
}
```

### Subscribing to multiple events

```tsx
useEffect(() => {
  const events = [
    SSE_EVENT_TYPES.BOOKING_CREATED,
    SSE_EVENT_TYPES.BOOKING_CANCELLED,
    SSE_EVENT_TYPES.REQUEST_MATCHED,
  ];

  const unsubscribers = events.map((type) =>
    subscribe(type, () => refetch())
  );

  return () => unsubscribers.forEach((u) => u());
}, [subscribe, refetch]);
```

---

## Connection Lifecycle

| Trigger | Behaviour |
|---------|-----------|
| User logs in | EventSource opens to `GET /sse` |
| Tab closed / user navigates away | `req.on('close')` fires on server, client tears down |
| User logs out | EventSource closed and nullified |
| Network error / disconnect | Automatic reconnect with exponential backoff (1s → 2s → 4s … max 30s) |

The `connected` boolean from `useSSE()` reflects the current stream state and can be used to show a connectivity indicator:
```tsx
const { connected } = useSSE();
// connected === true: stream is open
```

---

## Design Rules

1. **Never open your own `EventSource`** — always use `useSSE().subscribe()`.
2. **Never use `useSocket()` for data refresh** — that was the old workaround. `onRefresh`/`offRefresh` have been removed from `SocketProvider`.
3. **Always return the unsubscribe function** from `useEffect` to avoid memory leaks.
4. **Don't add polling** — if events aren't arriving, debug the SSE stream in DevTools → Network → `/sse`.
