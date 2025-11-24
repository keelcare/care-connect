import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    loading: boolean;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        await onConfirm(reason);
        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-strong animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    disabled={loading}
                >
                    <X size={20} className="text-neutral-400" />
                </button>

                <h2 className="text-2xl font-bold text-neutral-900 font-display mb-2">Cancel Booking</h2>
                <p className="text-neutral-500 mb-6">
                    Please tell us why you need to cancel. This helps us improve our service.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Reason for cancellation
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px] resize-none"
                            placeholder="I need to cancel because..."
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl border-neutral-200"
                            disabled={loading}
                        >
                            Keep Booking
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white border-none"
                            disabled={loading || !reason.trim()}
                        >
                            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
