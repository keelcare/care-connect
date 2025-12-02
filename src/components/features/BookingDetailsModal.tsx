import React from 'react';
import Image from 'next/image';
import { X, Calendar, Clock, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types/api';

interface BookingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onMessage: (booking: Booking) => void;
    onCancel: (booking: Booking) => void;
    loading?: boolean;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    isOpen,
    onClose,
    booking,
    onMessage,
    onCancel,
    loading
}) => {
    if (!isOpen || !booking) return null;

    const nanny = booking.nanny;
    const nannyName = nanny?.profiles?.first_name && nanny?.profiles?.last_name
        ? `${nanny.profiles.first_name} ${nanny.profiles.last_name}`
        : nanny?.email || 'Nanny';
    const nannyImage = nanny?.profiles?.profile_image_url;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
            case 'COMPLETED': return 'bg-neutral-100 text-neutral-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-lg p-8 relative shadow-strong animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-neutral-400" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 mx-auto mb-4 overflow-hidden border-4 border-white shadow-md">
                        {nannyImage ? (
                            <Image
                                src={nannyImage}
                                alt={nannyName}
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-2xl font-bold">
                                {nannyName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 font-display">{nannyName}</h2>
                    <p className="text-neutral-500">Caregiver</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                        <span className="text-neutral-500 font-medium">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 flex-shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-neutral-900">Date</p>
                                <p className="text-neutral-500">{formatDate(booking.start_time)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 flex-shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-neutral-900">Time</p>
                                <p className="text-neutral-500">
                                    {formatTime(booking.start_time)} - {booking.end_time ? formatTime(booking.end_time) : 'TBD'}
                                </p>
                            </div>
                        </div>

                        {booking.notes && (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">Notes</p>
                                    <p className="text-neutral-500">{booking.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
                        <Button
                            onClick={() => onMessage(booking)}
                            className="w-full rounded-xl shadow-md py-6 text-lg"
                        >
                            <MessageSquare size={20} className="mr-2" />
                            Message {nannyName.split(' ')[0]}
                        </Button>

                        {(booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') && (
                            <Button
                                variant="outline"
                                onClick={() => onCancel(booking)}
                                className="w-full rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 py-6"
                                disabled={loading}
                            >
                                Cancel Booking
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
