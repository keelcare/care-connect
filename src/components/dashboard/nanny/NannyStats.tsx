import React from 'react';
import { Wallet, Briefcase, Star, Clock } from 'lucide-react';

interface NannyStatsProps {
  earnings: {
    totalEarned: number;
    pendingEarned: number;
  };
  completedBookingsCount: number;
  rating: number;
  reviewCount: number;
}

export function NannyStats({ earnings, completedBookingsCount, rating, reviewCount }: NannyStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Earnings Card */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-900 p-6 text-white shadow-xl shadow-primary-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Wallet className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Total Earnings</span>
          </div>
          <h3 className="text-4xl font-heading font-semibold mb-1">
            ₹{earnings.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Bookings Card */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-900 p-6 text-white shadow-xl shadow-primary-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Briefcase className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Completed Sessions</span>
          </div>
          <h3 className="text-4xl font-heading font-semibold mb-1">
            {completedBookingsCount}
          </h3>
          <p className="text-sm opacity-75 mt-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            Keep up the great work!
          </p>
        </div>
      </div>

      {/* Rating Card */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-900 p-6 text-white shadow-xl shadow-primary-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Star className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-medium">Average Rating</span>
          </div>
          <h3 className="text-4xl font-heading font-semibold mb-1 flex items-baseline gap-1">
            {rating.toFixed(1)} <span className="text-xl opacity-70">/ 5</span>
          </h3>
          <p className="text-sm opacity-75 mt-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>
    </div>
  );
}
