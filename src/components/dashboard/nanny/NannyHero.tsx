import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function NannyHero() {
    const { user } = useAuth();
    const firstName = user?.profiles?.first_name || 'Nanny';

    return (
        <div className="mb-6 mt-3">
            <h1 className="text-fluid-4xl font-heading font-medium text-wellness-navy mb-1.5 tracking-tight">
                Good morning, {firstName}
            </h1>
            <p className="text-base text-gray-500 font-medium opacity-80">
                You have a session coming up shortly. Have a wonderful day!
            </p>
        </div>
    );
}
