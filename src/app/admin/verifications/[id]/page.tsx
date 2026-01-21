'use client';

import { useEffect, useState } from 'react';
import { api, API_URL } from '@/lib/api';
import { User } from '@/types/api';
import { useParams, useRouter } from 'next/navigation';

export default function VerificationDetailPage() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      // 1. Get document data from pending list (contains identity_documents)
      const pendingUsers = await api.verification.getPending();
      const pendingUser = pendingUsers.find((u) => u.id === id);

      // 2. Get full profile data (phone, address) from standard endpoint
      const detailedUser = await api.users.get(id);

      if (pendingUser) {
        // Merge: Use detailed profile but keep the documents from pending list
        setUser({
          ...detailedUser,
          identity_documents: pendingUser.identity_documents,
          identity_verification_status:
            pendingUser.identity_verification_status,
        });
      } else {
        setUser(detailedUser);
      }
    } catch (error) {
      console.error('Failed to fetch user details', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this user?')) return;

    setProcessing(true);
    try {
      await api.verification.approve(id);
      router.push('/admin/verifications');
      router.refresh();
    } catch (error) {
      console.error('Failed to approve user', error);
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
      console.error('Failed to reject user', error);
      alert('Failed to reject user');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verification Request
          </h1>
          <p className="text-gray-500">Review documents for {user.email}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          &larr; Back to List
        </button>
      </div>

      <div className="bg-white shadow-soft rounded-[24px] overflow-hidden border border-neutral-100 mb-8">
        <div className="px-6 py-4 border-b border-neutral-100 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">User Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Full Name
            </span>
            <span className="text-gray-900">
              {user.profiles?.full_name ||
                `${user.profiles?.first_name} ${user.profiles?.last_name}`}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Email
            </span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Phone
            </span>
            <span className="text-gray-900">
              {user.profiles?.phone || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Address
            </span>
            <span className="text-gray-900">
              {user.profiles?.address || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-soft rounded-[24px] overflow-hidden border border-neutral-100 mb-8">
        <div className="px-6 py-4 border-b border-neutral-100 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            Submitted Documents
          </h3>
        </div>
        <div className="p-6">
          {user.identity_documents && user.identity_documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.identity_documents.map((doc, index) => {
                const fullUrl = doc.file_path.startsWith('http')
                  ? doc.file_path
                  : `${API_URL}/${doc.file_path}`;
                const isPdf = doc.file_path.toLowerCase().endsWith('.pdf');

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-2"
                  >
                    <div className="relative aspect-video bg-gray-100 rounded overflow-hidden mb-2">
                      {isPdf ? (
                        <iframe
                          src={`${fullUrl}#toolbar=0&navpanes=0`}
                          className="w-full h-full"
                          title={`Document ${index + 1}`}
                        />
                      ) : (
                        <img
                          src={fullUrl}
                          alt={`Document ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="space-y-1 px-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className="text-sm font-medium text-gray-900 truncate max-w-[150px]"
                            title={
                              doc.original_name ||
                              doc.file_path.split('/').pop()
                            }
                          >
                            {doc.original_name ||
                              doc.file_path.split('/').pop()}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                            {doc.type}
                          </span>
                        </div>
                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:underline whitespace-nowrap ml-2"
                        >
                          Open Original
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic">No documents found.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={processing}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-medium disabled:opacity-50"
        >
          Reject Verification
        </button>
        <button
          onClick={handleApprove}
          disabled={processing}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium disabled:opacity-50"
        >
          Approve Verification
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Reject Verification
            </h3>
            <p className="text-gray-600 mb-4">
              Please specify the reason for rejection. This will be shown to the
              user.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document is blurry, Name mismatch..."
              className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || processing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
