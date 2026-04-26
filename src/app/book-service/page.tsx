import React, { Suspense } from 'react';
import ParentLayout from '@/components/layout/ParentLayout';
import BookServiceContent from './BookServiceContent';
import { Spinner } from '@/components/ui/Spinner';
import { Skeleton } from 'boneyard-js/react';

export default function BookServicePage() {
  return (
    <ParentLayout>
      <Skeleton
        name="book-service"
        loading={false} // Managed by Suspense mostly, but good for capture
        minHeight="100vh"
        fixture={
          <div className="min-h-dvh bg-[#F8F9FA] p-8 space-y-12">
            <div className="flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
              <div className="h-6 w-32 bg-gray-200 rounded-full mb-4" />
              <div className="h-16 w-full bg-gray-200 rounded-2xl mb-6" />
              <div className="h-12 w-4/5 bg-gray-100 rounded-xl" />
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 w-full bg-white rounded-3xl border border-gray-100 shadow-sm" />
              ))}
            </div>
          </div>
        }
      >
        <Suspense fallback={
          <div className="min-h-dvh bg-[#F8F9FA] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" variant="primary" />
              <p className="text-gray-500 font-medium animate-pulse">Loading options...</p>
            </div>
          </div>
        }>
          <BookServiceContent />
        </Suspense>
      </Skeleton>
    </ParentLayout>
  );
}
