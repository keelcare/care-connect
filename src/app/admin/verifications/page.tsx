'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import Link from 'next/link';
import { ShieldCheck, FileText } from 'lucide-react';

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

export default function AdminPendingVerificationsPage() {
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
      console.error('Failed to fetch pending verifications', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-900 font-display">
          Pending Identity Verifications
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Review and approve caregiver identity documents.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-[28px] shadow-soft p-12 text-center border border-neutral-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={26} />
          </div>
          <p className="text-neutral-700 text-lg font-semibold">All caught up</p>
          <p className="text-neutral-400 text-sm mt-1">
            There are no pending verifications right now.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[28px] shadow-soft border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-100">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profiles?.profile_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                            src={user.profiles.profile_image_url}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold shrink-0">
                            {user.profiles?.first_name?.[0] || user.email[0].toUpperCase()}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-neutral-900">
                            {user.profiles?.full_name ||
                              `${user.profiles?.first_name || ''} ${user.profiles?.last_name || ''}`.trim() ||
                              'Unnamed user'}
                          </div>
                          <div className="text-xs text-neutral-400 font-mono">
                            {user.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                        <FileText size={12} />
                        {user.identity_documents?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatIST(submittedAt(user))}
                      <span className="ml-1 text-xs text-neutral-400">IST</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/verifications/${user.id}`}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-semibold hover:bg-primary-800 transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
