import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { api } from '@/lib/api';
import { CategoryRequest } from '@/types/api';

interface CategoryRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCategories: string[];
    onSuccess: () => void;
}

export function CategoryRequestModal({
    isOpen,
    onClose,
    currentCategories,
    onSuccess,
}: CategoryRequestModalProps) {
    const [selectedCategories, setSelectedCategories] =
        useState<string[]>(currentCategories);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingRequest, setPendingRequest] = useState<CategoryRequest | null>(
        null
    );
    const [isCancelling, setIsCancelling] = useState(false);

    const categoriesOptions = [
        { label: 'Elder Care', value: 'EC' },
        { label: 'Child Care', value: 'CC' },
        { label: 'Special Needs', value: 'SN' },
        { label: 'Shadow Teacher', value: 'ST' },
    ];

    useEffect(() => {
        if (isOpen) {
            checkPendingRequest();
            setSelectedCategories(currentCategories);
        }
    }, [isOpen, currentCategories]);

    const checkPendingRequest = async () => {
        try {
            const request = await api.nanny.getCategoryRequest();
            // Validate that we got a real request object with an ID
            if (request && typeof request === 'object' && request.id) {
                setPendingRequest(request);
                if (request.requested_categories && Array.isArray(request.requested_categories)) {
                    setSelectedCategories(request.requested_categories);
                }
            } else {
                setPendingRequest(null);
            }
        } catch (err) {
            console.error('Failed to check pending request', err);
            setPendingRequest(null);
        }
    };

    const handleSubmit = async () => {
        if (selectedCategories.length === 0) {
            setError('Please select at least one category.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.nanny.requestCategoryChange(selectedCategories);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to submit request', err);
            setError('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!pendingRequest || !pendingRequest.id) {
            setError('No request ID found to cancel.');
            return;
        }

        if (!confirm('Are you sure you want to cancel this request?')) return;

        setIsCancelling(true);
        setError(null);

        try {
            await api.nanny.cancelCategoryRequest(pendingRequest.id);
            setPendingRequest(null);
            setSelectedCategories(currentCategories);
            onSuccess();
        } catch (err) {
            console.error('Failed to cancel request', err);
            setError('Failed to cancel request. It may have already been processed.');
        } finally {
            setIsCancelling(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Categories">
            <div className="space-y-6">
                {pendingRequest ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                        <p className="font-bold mb-1">Request Pending</p>
                        <p>
                            You have a pending request to update your categories. Please wait
                            for admin approval.
                        </p>
                        <div className="mt-2 text-xs">
                            Requested: {pendingRequest.requested_categories?.join(', ') || 'N/A'}
                        </div>
                    </div>
                ) : (
                    <p className="text-neutral-600">
                        Select the categories you are qualified for. Changes will require
                        admin approval.
                    </p>
                )}

                <div className="space-y-2">
                    <MultiSelect
                        label="Categories"
                        placeholder="Select categories..."
                        options={categoriesOptions}
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                        disabled={!!pendingRequest}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    {pendingRequest ? (
                        <>
                            <Button variant="outline" onClick={onClose} disabled={isCancelling}>
                                Close
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                isLoading={isCancelling}
                            >
                                Cancel Request
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    )}
                    {!pendingRequest && (
                        <Button onClick={handleSubmit} isLoading={loading}>
                            Submit Request
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
