'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ManualAssignmentNanny, ServiceRequest } from '@/types/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle, User, Award } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface NannyAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: ServiceRequest | null;
    onAssigned: () => void;
}

export function NannyAssignmentModal({
    isOpen,
    onClose,
    request,
    onAssigned,
}: NannyAssignmentModalProps) {
    const { addToast } = useToast();
    const [nannies, setNannies] = useState<ManualAssignmentNanny[]>([]);
    const [loading, setLoading] = useState(false);
    const [assigningLoading, setAssigningLoading] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && request) {
            fetchNannies();
        }
    }, [isOpen, request]);

    const fetchNannies = async () => {
        if (!request) return;
        setLoading(true);
        console.log(`[ManualAssignment] Fetching nannies for request: ${request.id}`);
        try {
            const data = await api.admin.manualAssignment.getAvailableNannies(request.id);
            console.log(`[ManualAssignment] Received ${data.length} nannies:`, data);
            // Sort by match score descending
            setNannies(data.sort((a, b) => b.matchScore - a.matchScore));
        } catch (error) {
            console.error('[ManualAssignment] Failed to fetch nannies:', error);
            addToast({ type: 'error', message: 'Failed to load available nannies' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (nannyId: string) => {
        if (!request) return;
        setAssigningLoading(nannyId);
        try {
            await api.admin.manualAssignment.assignNanny({
                requestId: request.id,
                nannyId,
            });
            addToast({ type: 'success', message: 'Nanny assigned successfully' });
            onAssigned();
            onClose();
        } catch (error) {
            console.error('Failed to assign nanny:', error);
            addToast({ type: 'error', message: 'Failed to assign nanny' });
        } finally {
            setAssigningLoading(null);
        }
    };

    const formatTime = (timeInput: string) => {
        if (!timeInput) return '—';
        try {
            if (timeInput.includes('T')) {
                const date = new Date(timeInput);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                }
            }
            if (timeInput.includes(':')) {
                const parts = timeInput.split(':');
                let h = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10);
                if (!isNaN(h) && !isNaN(m)) {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const h12 = h % 12 || 12;
                    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                }
            }
            return timeInput;
        } catch (e) {
            return timeInput;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Shadow Teacher / Special Needs Nanny"
            maxWidth="xl"
        >
            <div className="space-y-6">
                {request && (
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex flex-wrap gap-4 items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                                Request Details
                            </p>
                            <h3 className="text-lg font-bold text-neutral-900">
                                {request.category === 'ST' ? 'Shadow Teacher' : 'Special Needs'} Request
                            </h3>
                            <p className="text-sm text-neutral-600">
                                {formatDate(request.date)} | {formatTime(request.start_time)} ({request.duration_hours}h)
                            </p>
                        </div>
                        <div className="text-right">
                            <Badge variant="secondary" className="bg-primary-50 text-primary-700">
                                {request.location?.address.split(',')[0]}
                            </Badge>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
                        Matched Nannies
                        <span className="text-sm font-normal text-neutral-500">
                            ({nannies.length} found within 15km)
                        </span>
                    </h4>

                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <Spinner />
                        </div>
                    ) : nannies.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {nannies.map((nanny) => (
                                <div
                                    key={nanny.id}
                                    className="p-5 border border-neutral-100 rounded-2xl bg-white hover:border-primary-200 transition-all shadow-sm hover:shadow-md group"
                                >
                                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                                        <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 overflow-hidden relative">
                                            {nanny.profiles?.profile_image_url ? (
                                                <img
                                                    src={nanny.profiles.profile_image_url}
                                                    alt={nanny.profiles.first_name || 'Nanny'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User size={32} />
                                            )}
                                            {nanny.is_verified && (
                                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle size={16} className="text-green-500 fill-green-50" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h5 className="font-bold text-neutral-900 text-lg">
                                                    {nanny.profiles?.first_name} {nanny.profiles?.last_name}
                                                </h5>
                                                <Badge className="bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1">
                                                    <Star size={12} className="fill-amber-500 text-amber-500" />
                                                    {nanny.averageRating?.toFixed(1) || 'New'}
                                                </Badge>
                                                <Badge className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                                                    <Award size={12} />
                                                    {nanny.matchScore}% Match
                                                </Badge>
                                                {nanny.matchingDetails?.isFavorite && (
                                                    <Badge className="bg-pink-50 text-pink-700 border-pink-100">
                                                        Parent's Favorite
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-neutral-400" />
                                                    {nanny.distance.toFixed(1)} km away
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Award size={14} className="text-neutral-400" />
                                                    {nanny.nanny_details?.experience_years || 0} years exp.
                                                </span>
                                                <span className="flex items-center gap-1 font-medium text-emerald-600">
                                                    ₹{nanny.nanny_details?.hourly_rate}/hr
                                                </span>
                                                <span className="flex items-center gap-1 text-neutral-500">
                                                    {nanny.matchingDetails?.acceptanceRate || 0}% Acc. rate
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {nanny.nanny_details?.skills.slice(0, 4).map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className={`text-[10px] px-2 py-0.5 rounded-full border ${nanny.matchingDetails?.skillsMatched.includes(skill)
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : 'bg-neutral-50 text-neutral-600 border-neutral-100'
                                                            }`}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 w-full md:w-auto">
                                            <Button
                                                onClick={() => handleAssign(nanny.id)}
                                                disabled={assigningLoading !== null}
                                                className="w-full md:w-auto rounded-xl shadow-sm group-hover:shadow-md transition-all"
                                            >
                                                {assigningLoading === nanny.id ? (
                                                    <Spinner className="mr-2" size="sm" />
                                                ) : null}
                                                Assign Nanny
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                            <p className="text-neutral-500">No available nannies found for this request.</p>
                            <p className="text-sm text-neutral-400 mt-1">
                                Try again later or check nanny availability.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="ghost" onClick={onClose} disabled={assigningLoading !== null}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
