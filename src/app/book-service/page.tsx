import React, { Suspense } from 'react';
import ParentLayout from '@/components/layout/ParentLayout';
import BookServiceContent from './BookServiceContent';
import { Spinner } from '@/components/ui/Spinner';

export default function BookServicePage() {
  return (
    <ParentLayout>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" variant="primary" />
            <p className="text-gray-500 font-medium animate-pulse">Loading options...</p>
          </div>
        </div>
      }>
        <BookServiceContent />
      </Suspense>
    </ParentLayout>
  );
}
