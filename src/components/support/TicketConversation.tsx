'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '@/lib/api';
import { SupportTicketMessage } from '@/types/api';
import { logger } from '@/lib/logger';

interface TicketConversationProps {
  ticketId: string;
  /** Whose perspective is rendering — controls which bubbles are "mine". */
  viewerIsAdmin: boolean;
  /** Optional height class for the scroll area. */
  className?: string;
}

const POLL_MS = 10000;

/**
 * Shared per-ticket conversation between the ticket raiser and admin.
 * REST + light polling (no socket). Used by both the admin ticket detail page
 * and the user-side conversation modal.
 */
export function TicketConversation({
  ticketId,
  viewerIsAdmin,
  className = 'h-80',
}: TicketConversationProps) {
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const msgs = await api.support.getTicketMessages(ticketId);
      setMessages(msgs);
    } catch (err) {
      logger.error('Failed to load ticket messages', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const msg = await api.support.sendTicketMessage(ticketId, { content });
      setMessages((prev) => [...prev, msg]);
      setInput('');
    } catch (err) {
      logger.error('Failed to send ticket message', err);
    } finally {
      setSending(false);
    }
  };

  const senderName = (m: SupportTicketMessage) => {
    if (m.is_admin) return 'Support';
    const p = m.sender?.profiles;
    if (p?.first_name) return `${p.first_name} ${p.last_name ?? ''}`.trim();
    return m.sender?.email?.split('@')[0] ?? 'User';
  };

  return (
    <div className="flex flex-col">
      <div className={`overflow-y-auto ${className} space-y-3 pr-1`}>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-sm text-neutral-400 py-8">
            No messages yet. Start the conversation below.
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.is_admin === viewerIsAdmin;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-neutral-400 mb-0.5 px-1">
                  {senderName(m)}
                </span>
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-snug whitespace-pre-wrap break-words ${
                    mine
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[10px] text-neutral-300 mt-0.5 px-1">
                  {new Date(m.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="mt-3 flex items-end gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder="Type a message…"
          className="flex-1 max-h-28 resize-none px-4 py-2.5 bg-neutral-100 rounded-2xl border-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all text-sm placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send message"
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
