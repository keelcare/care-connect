'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { AdminDispute } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function AdminDisputesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'open' | 'investigating' | 'resolved'
  >('all');
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(
    null
  );
  const [resolution, setResolution] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchDisputes();
  }, [user]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await api.enhancedAdmin.getDisputes();
      setDisputes(data);
    } catch (err) {
      setError('Failed to load disputes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedDispute || !resolution.trim()) return;

    setResolving(true);
    try {
      await api.enhancedAdmin.resolveDispute(selectedDispute.id, resolution);
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === selectedDispute.id
            ? { ...d, status: 'resolved' as const, resolution }
            : d
        )
      );
      setSelectedDispute(null);
      setResolution('');
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    } finally {
      setResolving(false);
    }
  };

  const filteredDisputes = disputes.filter(
    (d) => filter === 'all' || d.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'investigating':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle size={14} />;
      case 'investigating':
        return <Clock size={14} />;
      case 'resolved':
        return <CheckCircle size={14} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900 font-display">
                Disputes
              </h1>
              <p className="text-stone-500">
                Review and resolve reported issues
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'open', 'investigating', 'resolved'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                  filter === status
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                )}
              >
                {status}
              </button>
            )
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Disputes List */}
        <div className="space-y-4">
          {filteredDisputes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                No disputes found
              </h3>
              <p className="text-stone-500">
                {filter === 'all'
                  ? 'No disputes have been reported yet.'
                  : `No ${filter} disputes.`}
              </p>
            </div>
          ) : (
            filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border',
                          getStatusColor(dispute.status)
                        )}
                      >
                        {getStatusIcon(dispute.status)}
                        {dispute.status}
                      </span>
                      <span className="text-sm text-stone-400">
                        {new Date(dispute.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-stone-900 mb-1">
                      Booking #{dispute.booking_id.slice(0, 8)}
                    </h3>
                    <p className="text-stone-600 mb-4">{dispute.reason}</p>

                    {dispute.resolution && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-emerald-700 mb-1">
                          Resolution:
                        </p>
                        <p className="text-emerald-800">{dispute.resolution}</p>
                      </div>
                    )}
                  </div>

                  {dispute.status !== 'resolved' && (
                    <Button
                      onClick={() => setSelectedDispute(dispute)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resolution Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Resolve Dispute
              </h3>
              <p className="text-stone-500 mb-4">
                Provide a resolution for this dispute.
              </p>

              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-stone-700 mb-1">
                  Reason:
                </p>
                <p className="text-stone-600">{selectedDispute.reason}</p>
              </div>

              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter your resolution..."
                rows={4}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none mb-4"
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDispute(null);
                    setResolution('');
                  }}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResolve}
                  disabled={!resolution.trim() || resolving}
                  isLoading={resolving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                >
                  Submit Resolution
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
