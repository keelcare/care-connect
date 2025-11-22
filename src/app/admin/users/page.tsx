"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from './page.module.css';

export default function AdminUsersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.admin.getUsers();
            setUsers(data);
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
            setUsers(users.map(u => u.id === userId ? updated : u));
        } catch (err) {
            console.error('Failed to verify user:', err);
            alert(err instanceof Error ? err.message : 'Failed to verify user');
        } finally {
            setActionLoading(null);
        }
    };

    const handleBanUser = async (userId: string) => {
        if (!confirm('Are you sure you want to ban this user?')) return;

        try {
            setActionLoading(userId);
            const updated = await api.admin.banUser(userId);
            setUsers(users.map(u => u.id === userId ? updated : u));
        } catch (err) {
            console.error('Failed to ban user:', err);
            alert(err instanceof Error ? err.message : 'Failed to ban user');
        } finally {
            setActionLoading(null);
        }
    };

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

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin')}
                    className="rounded-xl"
                >
                    ← Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold text-neutral-900 font-display">User Management</h1>
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Verified</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-neutral-900">
                                            {u.profiles?.first_name && u.profiles?.last_name
                                                ? `${u.profiles.first_name} ${u.profiles.last_name}`
                                                : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'nanny' ? 'bg-primary-100 text-primary-700' :
                                                    'bg-secondary-100 text-secondary-700'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {u.is_verified ? (
                                            <div className="flex items-center text-green-600">
                                                <CheckCircle size={20} className="mr-1.5" />
                                                <span className="text-sm font-medium">Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-neutral-400">
                                                <XCircle size={20} className="mr-1.5" />
                                                <span className="text-sm font-medium">Unverified</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {actionLoading === u.id ? (
                                            <Spinner />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {!u.is_verified && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleVerifyUser(u.id)}
                                                        className="rounded-lg text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleBanUser(u.id)}
                                                    className="rounded-lg text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                >
                                                    Ban
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
