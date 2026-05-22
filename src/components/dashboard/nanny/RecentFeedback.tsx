import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star, ArrowRight } from 'lucide-react';
import { Review } from '@/types/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RecentFeedbackProps {
    reviews?: Review[];
}

export function RecentFeedback({ reviews = [] }: RecentFeedbackProps) {
    return (
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-heading font-semibold text-gray-900">Recent Feedback</h3>
                {reviews.length > 0 && (
                    <Link href="/dashboard/reviews" className="text-xs font-semibold text-[#0D2B45]/50 hover:text-[#0D2B45] transition-colors">
                        View All
                    </Link>
                )}
            </div>

            {reviews.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                        <Star className="w-5 h-5 text-neutral-300" />
                    </div>
                    <p className="text-sm font-medium text-neutral-500">No reviews yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Reviews from completed sessions will appear here.</p>
                </div>
            ) : (
                <div className="flex-1 space-y-5">
                    {reviews.map((review: any) => (
                        <div key={review.id}>
                            <div className="flex gap-1 mb-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                            </p>
                            {review.comment && (
                                <p className="text-gray-600 italic text-[13px] leading-relaxed mb-3">
                                    &ldquo;{review.comment}&rdquo;
                                </p>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#0D2B45]/10 flex items-center justify-center text-[#0D2B45] font-bold text-[10px]">
                                    {review.reviewer?.profiles?.first_name?.[0] ?? '?'}
                                </div>
                                <span className="font-semibold text-[13px] text-gray-900">
                                    {review.reviewer?.profiles?.first_name} {review.reviewer?.profiles?.last_name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
