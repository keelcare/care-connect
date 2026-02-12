import React from 'react';
import { ClipboardList, Calendar, ShieldCheck, FileText } from 'lucide-react';
import { QuickActionCard } from '../QuickActionCard';
import { useRouter } from 'next/navigation';

export function QuickActions() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
           
             <QuickActionCard
                title="Availability"
                subtitle="Update your working hours for next week."
                icon={Calendar}
                color="bg-blue-100 text-blue-700"
                onClick={() => router.push('/dashboard/availability')}
            />
            
        </div>
    );
}
