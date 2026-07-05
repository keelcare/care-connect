import React from 'react';

/** Card-shaped loading placeholder matching the booking / series card silhouette. */
export function BookingCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm" aria-hidden="true">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-shrink-0 animate-pulse rounded-full bg-slate-200/70" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/5 animate-pulse rounded-lg bg-slate-200/70" />
          <div className="h-3 w-3/5 animate-pulse rounded-lg bg-slate-200/60" />
        </div>
        <div className="hidden h-6 w-20 animate-pulse rounded-full bg-slate-200/60 sm:block" />
      </div>
      <div className="my-5 h-px bg-slate-100" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200/70" />
          <div className="h-3 w-40 animate-pulse rounded-lg bg-slate-200/60" />
        </div>
        <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200/60" />
      </div>
    </div>
  );
}

export function BookingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>
  );
}
