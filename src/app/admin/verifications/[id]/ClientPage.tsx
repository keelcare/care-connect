'use client';

import { useEffect, useState } from 'react';
import { api, API_URL } from '@/lib/api';
import { User } from '@/types/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/ui';
import { logger } from '@/lib/logger';

type DocPreview = { url: string; isPdf: boolean };

export default function VerificationDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [docPreviews, setDocPreviews] = useState<Record<string, DocPreview>>({});
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUser = async () => {
    try {
      // 1. Get document data from pending list (contains identity_documents)
      const pendingUsers = await api.verification.getPending();
      const pendingUser = pendingUsers.find((u) => u.id === id);

      // 2. Get full profile data (phone, address) from standard endpoint
      const detailedUser = await api.users.get(id);

      if (pendingUser) {
        setUser({
          ...detailedUser,
          identity_documents: pendingUser.identity_documents,
          identity_verification_status: pendingUser.identity_verification_status,
        });
      } else {
        setUser(detailedUser);
      }
    } catch (error) {
      logger.error('Failed to fetch user details', error);
    } finally {
      setLoading(false);
    }
  };

  // Documents live in private Supabase storage — fetch each via the authenticated
  // stream endpoint and turn it into an object URL we can preview / open.
  useEffect(() => {
    if (!user?.identity_documents?.length) return;
    const docs = user.identity_documents;
    const created: string[] = [];
    let cancelled = false;

    (async () => {
      for (const doc of docs) {
        try {
          const res = await fetch(`${API_URL}/verification/document/${doc.id}`, {
            credentials: 'include',
          });
          if (!res.ok || cancelled) continue;
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          created.push(url);
          const isPdf =
            blob.type === 'application/pdf' ||
            doc.file_path.toLowerCase().endsWith('.pdf');
          if (!cancelled) {
            setDocPreviews((prev) => ({ ...prev, [doc.id]: { url, isPdf } }));
          }
        } catch {
          /* skip unreadable document */
        }
      }
    })();

    return () => {
      cancelled = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [user?.identity_documents]);

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this user?')) return;
    setProcessing(true);
    try {
      await api.verification.approve(id);
      router.push('/admin/verifications');
      router.refresh();
    } catch (error) {
      logger.error('Failed to approve user', error);
      alert('Failed to approve user');
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setProcessing(true);
    try {
      await api.verification.reject(id, { reason: rejectReason });
      router.push('/admin/verifications');
      router.refresh();
    } catch (error) {
      logger.error('Failed to reject user', error);
      alert('Failed to reject user');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center text-neutral-500">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/admin/verifications')}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-900 transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Back to List
      </button>

      <AdminPageHeader
        eyebrow="Trust & Safety"
        title="Verification Request"
        subtitle={`Review identity documents for ${user.email}`}
        icon={ShieldCheck}
      />

      {/* User details */}
      <div className="bg-white shadow-soft rounded-[24px] overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h3 className="text-base font-semibold text-neutral-900">User Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Detail label="Full Name" value={user.profiles?.full_name || `${user.profiles?.first_name ?? ''} ${user.profiles?.last_name ?? ''}`.trim() || 'N/A'} />
          <Detail label="Email" value={user.email} />
          <Detail label="Phone" value={user.profiles?.phone || 'N/A'} />
          <Detail label="Address" value={user.profiles?.address || 'N/A'} />
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white shadow-soft rounded-[24px] overflow-hidden border border-neutral-100">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h3 className="text-base font-semibold text-neutral-900">Submitted Documents</h3>
        </div>
        <div className="p-6">
          {user.identity_documents && user.identity_documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.identity_documents.map((doc) => {
                const preview = docPreviews[doc.id];
                const fileName = doc.original_name || doc.file_path.split('/').pop();
                return (
                  <div key={doc.id} className="border border-neutral-200 rounded-2xl p-3">
                    <div className="relative aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-3">
                      {!preview ? (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Loader2 size={22} className="animate-spin" />
                        </div>
                      ) : preview.isPdf ? (
                        <iframe
                          src={`${preview.url}#toolbar=0&navpanes=0`}
                          className="w-full h-full"
                          title={fileName}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview.url} alt={fileName} className="w-full h-full object-contain" />
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2 px-1">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate" title={fileName}>
                          {fileName}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary-50 text-primary-700 mt-1">
                          <FileText size={11} />
                          {doc.type}
                        </span>
                      </div>
                      {preview && (
                        <a
                          href={preview.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-900 whitespace-nowrap shrink-0"
                        >
                          Open
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400 italic">No documents found.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={processing}
          className="px-6 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold disabled:opacity-50 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={handleApprove}
          disabled={processing}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold disabled:opacity-50 transition-colors"
        >
          {processing ? 'Processing…' : 'Approve'}
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Reject Verification</h3>
            <p className="text-neutral-500 text-sm mb-4">
              Please specify the reason for rejection. This will be shown to the user.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document is blurry, name mismatch…"
              className="w-full border border-neutral-300 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || processing}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-neutral-900 text-sm mt-0.5 block">{value}</span>
    </div>
  );
}
