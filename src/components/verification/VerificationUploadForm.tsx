'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

type IdType = 'AADHAR' | 'PAN' | 'VOTER_ID';

interface VerificationUploadFormProps {
    onSuccess?: (data?: any) => void;
}

export default function VerificationUploadForm({ onSuccess }: VerificationUploadFormProps) {
    const [idType, setIdType] = useState<IdType>('AADHAR');
    const [idNumber, setIdNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!idNumber.trim()) {
            setError('Please enter your ID number.');
            setLoading(false);
            return;
        }

        if (!phone.trim()) {
            setError('Please enter your phone number.');
            setLoading(false);
            return;
        }

        if (!address.trim()) {
            setError('Please enter your address.');
            setLoading(false);
            return;
        }

        if (!file) {
            setError('Please select a document to upload.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('idType', idType);
            formData.append('idNumber', idNumber);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('file', file);

            const response = await api.verification.upload(formData);
            // Refresh to show pending status
            if (onSuccess) {
                onSuccess(response);
            } else {
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload documents.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[24px] shadow-soft border border-stone-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-stone-900 font-display">Identity Verification</h2>
            <p className="mb-8 text-stone-500">
                To complete your registration, please provide your identity details and upload a valid document.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="idType" className="block text-sm font-medium text-stone-700">
                        Document Type
                    </label>
                    <div className="relative">
                        <select
                            id="idType"
                            value={idType}
                            onChange={(e) => setIdType(e.target.value as IdType)}
                            className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow appearance-none"
                        >
                            <option value="AADHAR">Aadhar Card</option>
                            <option value="PAN">PAN Card</option>
                            <option value="VOTER_ID">Voter ID</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="idNumber" className="block text-sm font-medium text-stone-700">
                        ID Number
                    </label>
                    <input
                        type="text"
                        id="idNumber"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="Enter your document ID number"
                        className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-stone-700">
                        Address
                    </label>
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full residential address"
                        rows={3}
                        className="block w-full px-4 py-3 rounded-xl border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow outline-none resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700">
                        Upload Document
                    </label>

                    <label
                        htmlFor="file-upload"
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer relative
                            ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 hover:bg-stone-50'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                        />
                        <div className="space-y-1 text-center">
                            <svg
                                className={`mx-auto h-12 w-12 transition-colors ${isDragging ? 'text-emerald-500' : 'text-stone-400 group-hover:text-emerald-500'}`}
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-stone-600 justify-center">
                                <span className="relative font-medium text-emerald-600 focus-within:outline-none">
                                    Upload a file
                                </span>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-stone-500">PNG, JPG, PDF up to 5MB</p>
                        </div>
                    </label>

                    {file && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            {file.name}
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                    >
                        {loading ? 'Submitting...' : 'Submit Verification'}
                    </button>
                </div>
            </form>
        </div>
    );
}
