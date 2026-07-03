'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { useRouter } from 'next/navigation';
import { ShieldCheck, FileText, Clock } from 'lucide-react';
import {
  AdminPageHeader,
  SectionCard,
  StatusBadge,
  EmptyState,
  AdminTable,
  THead,
  TH,
  TR,
  TD,
} from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

/** Formats an ISO timestamp as IST, e.g. "07/02/2026, 14:35". */
function formatIST(ts?: string | null): string {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Most recent document upload time — the effective submission moment. */
function submittedAt(user: User): string | null {
  const times = (user.identity_documents ?? [])
    .map((d) => d.uploaded_at)
    .filter(Boolean) as string[];
  if (times.length === 0) return null;
  return times.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
}

function displayName(user: User) {
  return (
    user.profiles?.full_name ||
    `${user.profiles?.first_name || ''} ${user.profiles?.last_name || ''}`.trim() ||
    'Unnamed user'
  );
}

export default function AdminPendingVerificationsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const data = await api.verification.getPending();
      setUsers(data);
    } catch (error) {
      logger.error('Failed to fetch pending verifications', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        eyebrow="Trust & Safety"
        title="Identity Verifications"
        subtitle="Review and approve caregiver identity documents before they go live."
        icon={ShieldCheck}
        actions={
          <StatusBadge tone={users.length ? 'warning' : 'success'} dot>
            {users.length} pending
          </StatusBadge>
        }
      />

      {users.length === 0 ? (
        <SectionCard bodyClassName="p-0">
          <EmptyState
            icon={ShieldCheck}
            title="All caught up"
            description="There are no pending verifications right now."
          />
        </SectionCard>
      ) : (
        <SectionCard bodyClassName="p-0">
          <AdminTable>
            <THead>
              <TH>Caregiver</TH>
              <TH>Email</TH>
              <TH>Documents</TH>
              <TH>Submitted</TH>
              <TH className="text-right">Action</TH>
            </THead>
            <tbody>
              {users.map((user) => (
                <TR key={user.id} onClick={() => router.push(`/admin/verifications/${user.id}`)}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {user.profiles?.profile_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                          src={user.profiles.profile_image_url}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold shrink-0">
                          {displayName(user)[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 truncate">
                          {displayName(user)}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">
                          {user.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </TD>
                  <TD className="text-neutral-600">{user.email}</TD>
                  <TD>
                    <StatusBadge tone="info">
                      <FileText size={11} />
                      {user.identity_documents?.length || 0}
                    </StatusBadge>
                  </TD>
                  <TD className="text-neutral-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-neutral-400" />
                      {formatIST(submittedAt(user))}
                    </span>
                  </TD>
                  <TD className="text-right">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/verifications/${user.id}`);
                      }}
                      className="h-9 px-4 rounded-xl bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold"
                    >
                      Review
                    </Button>
                  </TD>
                </TR>
              ))}
            </tbody>
          </AdminTable>
        </SectionCard>
      )}
    </div>
  );
}
