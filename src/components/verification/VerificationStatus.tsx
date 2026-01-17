import { User } from '@/types/api';
import Link from 'next/link';

interface Props {
    status: 'pending' | 'verified' | 'rejected';
    rejectionReason?: string | null;
}

export default function VerificationStatus({ status, rejectionReason }: Props) {
    if (status === 'verified') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">You are Verified!</h2>
                <p className="text-emerald-700">Thank you for verifying your identity. You can now access all features of the platform.</p>
                <div className="mt-6">
                    <Link href="/nanny/dashboard" className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'rejected') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-2">Verification Rejected</h2>
                <p className="text-red-700 mb-4">Your identity verification was rejected.</p>
                {rejectionReason && (
                    <div className="bg-white p-4 rounded-md border border-red-100 text-left inline-block max-w-md mx-auto mb-6">
                        <p className="text-sm font-semibold text-red-800">Reason:</p>
                        <p className="text-red-600">{rejectionReason}</p>
                    </div>
                )}
                <p className="text-gray-600 mb-6">Please upload valid documents to try again.</p>
                {/* The parent page will likely render the upload form below this component if rejected */}
            </div>
        );
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Verification Pending</h2>
            <p className="text-blue-700">Your documents have been submitted and are awaiting approval from our admin team.</p>
            <p className="text-sm text-blue-600 mt-2">This process usually takes 24-48 hours.</p>
        </div>
    );
}
