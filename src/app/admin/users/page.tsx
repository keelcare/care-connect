'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User, Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckCircle, XCircle, Users, Baby, Heart, ShieldAlert } from 'lucide-react';
import NannyProfileModal from '@/components/admin/NannyProfileModal';
import ParentProfileModal from '@/components/admin/ParentProfileModal';

type Tab = 'nannies' | 'parents';

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-4 bg-white rounded-2xl border border-neutral-100 shadow-soft px-6 py-5"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-900 leading-none">{value}</p>
        <p className="text-xs font-medium text-neutral-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function UserTable({
  users,
  actionLoading,
  onBan,
  onUnban,
  onVerify,
  role,
  onNameClick,
}: {
  users: User[];
  actionLoading: string | null;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onVerify: (id: string) => void;
  role: Tab;
  onNameClick?: (id: string) => void;
}) {
  const accentClass =
    role === 'nannies'
      ? 'bg-violet-50 text-violet-700'
      : 'bg-emerald-50 text-emerald-700';

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Users size={40} className="mb-3 opacity-40" />
        <p className="text-sm font-medium">No {role} found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead className="border-b border-neutral-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Verified
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors group">
              {/* Avatar + Name */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${accentClass}`}
                  >
                    {u.profiles?.first_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  {onNameClick ? (
                    <button
                      onClick={() => onNameClick(u.id)}
                      className="font-medium text-neutral-900 hover:text-violet-600 hover:underline underline-offset-2 transition-colors text-left"
                    >
                      {u.profiles?.first_name && u.profiles?.last_name
                        ? `${u.profiles.first_name} ${u.profiles.last_name}`
                        : 'N/A'}
                    </button>
                  ) : (
                    <span className="font-medium text-neutral-900">
                      {u.profiles?.first_name && u.profiles?.last_name
                        ? `${u.profiles.first_name} ${u.profiles.last_name}`
                        : 'N/A'}
                    </span>
                  )}
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 text-neutral-500 text-sm">{u.email}</td>

              {/* Active / Banned */}
              <td className="px-6 py-4">
                {u.is_active !== false ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                    <ShieldAlert size={11} />
                    Banned
                  </span>
                )}
              </td>

              {/* Verified */}
              <td className="px-6 py-4">
                {u.is_verified ? (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle size={17} />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <XCircle size={17} />
                    <span className="text-xs font-medium">Unverified</span>
                  </div>
                )}
              </td>

              {/* Joined */}
              <td className="px-6 py-4 text-neutral-400 text-sm">
                {new Date(u.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                {actionLoading === u.id ? (
                  <Spinner />
                ) : (
                  <div className="flex items-center gap-2">
                    {!u.is_verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVerify(u.id)}
                        className="rounded-lg text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                      >
                        Verify
                      </Button>
                    )}
                    {u.is_active !== false ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onBan(u.id)}
                        className="rounded-lg text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      >
                        Ban
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUnban(u.id)}
                        className="rounded-lg text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                      >
                        Unban
                      </Button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('nannies');
  const [selectedNannyId, setSelectedNannyId] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, bookingsData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getBookings(),
      ]);
      setUsers(usersData);
      setAllBookings(bookingsData);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      const updated = await api.admin.verifyUser(userId);
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      console.error('Failed to verify user:', err);
      alert(err instanceof Error ? err.message : 'Failed to verify user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    const reason = prompt('Please enter a reason for banning this user (optional):');
    if (reason === null) return;
    try {
      setActionLoading(userId);
      const updated = await api.admin.banUser(userId, reason || undefined);
      setUsers(users.map((u) => (u.id === userId ? { ...updated, is_active: false } : u)));
    } catch (err) {
      console.error('Failed to ban user:', err);
      alert(err instanceof Error ? err.message : 'Failed to ban user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to unban this user?')) return;
    try {
      setActionLoading(userId);
      const updated = await api.admin.unbanUser(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...updated, is_active: true } : u)));
    } catch (err) {
      console.error('Failed to unban user:', err);
      alert(err instanceof Error ? err.message : 'Failed to unban user');
    } finally {
      setActionLoading(null);
    }
  };

  const nannies = useMemo(() => users.filter((u) => u.role === 'nanny'), [users]);
  const parents = useMemo(() => users.filter((u) => u.role === 'parent'), [users]);
  const bannedCount = useMemo(() => users.filter((u) => u.is_active === false).length, [users]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchUsers}>Retry</Button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'nannies', label: 'Nannies', count: nannies.length },
    { id: 'parents', label: 'Parents', count: parents.length },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Nanny Profile Modal */}
      {selectedNannyId && (
        <NannyProfileModal
          nannyId={selectedNannyId}
          allBookings={allBookings}
          onClose={() => setSelectedNannyId(null)}
        />
      )}

      {/* Parent Profile Modal */}
      {selectedParentId && (
        <ParentProfileModal
          parentId={selectedParentId}
          allBookings={allBookings}
          onClose={() => setSelectedParentId(null)}
        />
      )}
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-900 font-display">User Management</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Manage nannies and parents on the platform.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.length} icon={Users} color="bg-neutral-100 text-neutral-600" />
        <StatCard label="Nannies" value={nannies.length} icon={Baby} color="bg-violet-100 text-violet-600" />
        <StatCard label="Parents" value={parents.length} icon={Heart} color="bg-emerald-100 text-emerald-600" />
        <StatCard label="Banned" value={bannedCount} icon={ShieldAlert} color="bg-red-100 text-red-500" />
      </div>

      {/* Tab Container */}
      <div className="bg-white rounded-[28px] border border-neutral-100 shadow-soft overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-neutral-100 px-6 pt-5 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative pb-4 px-4 text-sm font-semibold transition-colors focus:outline-none
                  ${isActive ? 'text-primary-700' : 'text-neutral-400 hover:text-neutral-600'}
                `}
              >
                {tab.label}
                <span
                  className={`
                    ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold
                    ${isActive
                      ? tab.id === 'nannies'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-emerald-100 text-emerald-700'
                      : 'bg-neutral-100 text-neutral-400'
                    }
                  `}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <UserTable
          users={activeTab === 'nannies' ? nannies : parents}
          actionLoading={actionLoading}
          onBan={handleBanUser}
          onUnban={handleUnbanUser}
          onVerify={handleVerifyUser}
          role={activeTab}
          onNameClick={activeTab === 'nannies' ? setSelectedNannyId : setSelectedParentId}
        />
      </div>
    </div>
  );
}
