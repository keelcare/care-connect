'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import VerificationUploadForm from '@/components/verification/VerificationUploadForm';
import VerificationStatus from '@/components/verification/VerificationStatus';
import { useRouter } from 'next/navigation';

export default function NannyVerificationPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const userData = await api.users.me();

            // Redirect banned users to help page
            if (userData.is_active === false) {
                router.push('/nanny/help');
                return;
            }

            if (userData.role !== 'nanny') {
                router.push('/');
                return;
            }
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user', error);
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (data: any) => {
        if (user && data) {
            setUser({
                ...user,
                identity_verification_status: data.identity_verification_status || 'pending',
                identity_documents: data.identity_documents || []
            });
        } else {
            fetchUser();
        }
    };

    useEffect(() => {
        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Nanny Verification</h1>
                    <p className="mt-2 text-gray-600">Complete your profile verification to start accepting jobs.</p>
                </div>

                {user.identity_verification_status === 'verified' ? (
                    <div className="bg-white p-8 rounded-[24px] shadow-soft border border-emerald-100 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Congratulations!</h2>
                        <p className="text-lg text-gray-600">
                            Your profile has been successfully verified. You are now eligible to accept job requests.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-lg shadow-emerald-200"
                            >
                                Proceed to Dashboard
                            </button>
                        </div>
                    </div>
                ) : (user.identity_verification_status === 'pending' || (user.identity_documents && user.identity_documents.length > 0 && user.identity_verification_status !== 'rejected')) ? (
                    <div className="space-y-8">
                        <VerificationStatus
                            status="pending"
                            rejectionReason={null}
                        />

                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-4">
                                Made a mistake? You can withdraw this application and submit a new one.
                            </p>
                            <button
                                onClick={async () => {
                                    if (confirm('Are you sure? This will delete your current submission.')) {
                                        setLoading(true);
                                        try {
                                            await api.verification.reset();
                                            // Re-fetch user to get the cleared status, which will auto-switch to the upload form
                                            fetchUser();
                                        } catch (error) {
                                            console.error('Failed to reset', error);
                                            setLoading(false);
                                        }
                                    }
                                }}
                                className="text-stone-500 hover:text-stone-700 font-medium text-sm underline"
                            >
                                Withdraw and Submit New Application
                            </button>
                        </div>
                    </div>
                ) : user.identity_verification_status === 'rejected' ? (
                    <div className="space-y-8">
                        <VerificationStatus
                            status="rejected"
                            rejectionReason={user.verification_rejection_reason}
                        />
                        <VerificationUploadForm onSuccess={handleUploadSuccess} />
                    </div>
                ) : (
                    <VerificationUploadForm onSuccess={handleUploadSuccess} />
                )}
            </div>
        </div>
    );
}
