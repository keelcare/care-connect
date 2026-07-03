'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdminManualNanny, AdminManualRequest } from '@/types/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle, User, Award, Info } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import NannyProfileModal from '@/components/admin/NannyProfileModal';
import { logger } from '@/lib/logger';

interface NannyAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: AdminManualRequest | null;
    onAssigned: () => void;
}

export function NannyAssignmentModal({
    isOpen,
    onClose,
    request,
    onAssigned,
}: NannyAssignmentModalProps) {
    const { addToast } = useToast();
    const [nannies, setNannies] = useState<AdminManualNanny[]>([]);
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
        try {
            const data = await api.admin.manualAssignment.getAvailableNannies(request.id);
            // Sort by match score descending
            setNannies(data.sort((a, b) => b.match_details.total_score - a.match_details.total_score));
        } catch (error) {
            logger.error('[ManualAssignment] Failed to fetch nannies:', error);
            addToast({ type: 'error', message: 'Failed to load available nannies' });
        } finally {
            setLoading(false);
        }
    };

    const [conflictDates, setConflictDates] = useState<string[] | null>(null);
    const [pendingNannyId, setPendingNannyId] = useState<string | null>(null);
    const [viewingNannyId, setViewingNannyId] = useState<string | null>(null);

    const handleAssign = async (nannyId: string, force = false) => {
        if (!request) return;
        setAssigningLoading(nannyId);
        try {
            await api.admin.manualAssignment.assignNanny({
                ...(request.isBookingId ? { bookingId: request.id } : { requestId: request.id }),
                nannyId,
                force,
            });
            
            setConflictDates(null);
            setPendingNannyId(null);
            addToast({ type: 'success', message: 'Nanny assigned successfully' });
            onAssigned();
            onClose();
        } catch (error: any) {
            logger.error('Failed to assign nanny:', error);
            if (error.response?.data?.warning && error.response?.data?.overlaps) {
                setConflictDates(error.response.data.overlaps);
                setPendingNannyId(nannyId);
            } else {
                addToast({ type: 'error', message: error.response?.data?.message || 'Failed to assign nanny' });
            }
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
        <>
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
                                {request.address.split(',')[0]}
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
                                    <div
                                        className="flex flex-col md:flex-row gap-5 items-start md:items-center cursor-pointer"
                                        onClick={() => setViewingNannyId(nanny.id)}
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 overflow-hidden relative">
                                            {nanny.profile_image_url ? (
                                                <img
                                                    src={nanny.profile_image_url}
                                                    alt={nanny.first_name || 'Nanny'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User size={32} />
                                            )}
                                        </div>

                                        <div className="flex-grow space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h5 className="font-bold text-neutral-900 text-lg">
                                                    {nanny.first_name} {nanny.last_name}
                                                </h5>
                                                <Badge className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                                                    <Award size={12} />
                                                    {nanny.match_details.total_score}% Match
                                                </Badge>
                                                {nanny.match_details.score_breakdown.favorite_bonus > 0 && (
                                                    <Badge className="bg-pink-50 text-pink-700 border-pink-100">
                                                        Parent's Favorite
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-neutral-400" />
                                                    {nanny.distance_km.toFixed(1)} km away
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Award size={14} className="text-neutral-400" />
                                                    {nanny.experience_years || 0} years exp.
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {nanny.match_details.matching_skills.slice(0, 4).map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="text-[10px] px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-100"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-2 flex items-start gap-4 text-[11px] text-neutral-400">
                                                <div className="flex items-center gap-1" title="Skills Score">
                                                    <span className="font-semibold text-neutral-600">Skills:</span> {nanny.match_details.score_breakdown.skills}
                                                </div>
                                                <div className="flex items-center gap-1" title="Experience Score">
                                                    <span className="font-semibold text-neutral-600">Exp:</span> {nanny.match_details.score_breakdown.experience}
                                                </div>
                                                <div className="flex items-center gap-1" title="Acceptance Rate Score">
                                                    <span className="font-semibold text-neutral-600">Acc:</span> {nanny.match_details.score_breakdown.acceptance_rate}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
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

        {conflictDates && pendingNannyId && (
            <Modal
                isOpen={true}
                onClose={() => {
                    setConflictDates(null);
                    setPendingNannyId(null);
                }}
                title="Schedule Conflict Detected"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                        <Info className="shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-1">This nanny has overlapping bookings or is unavailable on some dates in this recurring plan:</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm font-mono mt-2">
                                {conflictDates.map(date => (
                                    <li key={date}>{date}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-600">
                        Do you want to ignore these conflicts and force the assignment anyway?
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setConflictDates(null);
                                setPendingNannyId(null);
                            }}
                            disabled={assigningLoading === pendingNannyId}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => handleAssign(pendingNannyId, true)}
                            disabled={assigningLoading === pendingNannyId}
                        >
                            {assigningLoading === pendingNannyId ? (
                                <Spinner className="mr-2 border-white border-t-transparent" size="sm" />
                            ) : null}
                            Force Assign Anyway
                        </Button>
                    </div>
                </div>
            </Modal>
        )}

        <NannyProfileModal
            nannyId={viewingNannyId}
            allBookings={[]}
            onClose={() => setViewingNannyId(null)}
        />
        </>
    );
}
