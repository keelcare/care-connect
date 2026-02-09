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
    // Mock data if none provided, to match the visuals
    const displayReviews = reviews.length > 0 ? reviews : [
        {
            id: 'mock-1',
            rating: 5,
            comment: '"Elena was wonderful with Leo today! He wouldn\'t stop talking about the crafts they made. Highly recommend!"',
            created_at: new Date().toISOString(),
            reviewer: {
                profiles: { first_name: 'Sarah', last_name: 'A.' }
            }
        }
    ];

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-semibold text-gray-900">Recent Feedback</h3>
                <Link href="/dashboard/reviews" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
            </div>

            <div className="flex-1">
                {displayReviews.map((review: any) => (
                    <div key={review.id} className="mb-6">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                        </p>
                        <p className="text-gray-600 Italic text-sm leading-relaxed mb-4">
                            {review.comment}
                        </p>
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-xs">
                                {review.reviewer?.profiles?.first_name?.[0] || 'S'}
                            </div>
                            <span className="font-bold text-sm text-gray-900">
                                - {review.reviewer?.profiles?.first_name} {review.reviewer?.profiles?.last_name || 'A.'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
