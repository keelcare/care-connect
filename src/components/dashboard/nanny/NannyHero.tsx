import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function NannyHero() {
    const { user } = useAuth();
    const firstName = user?.profiles?.first_name || 'Nanny';

    return (
        <div className="mb-8 mt-4">
            <h1 className="text-5xl font-heading font-medium text-wellness-navy mb-2 tracking-tight">
                Good morning, {firstName}
            </h1>
            <p className="text-lg text-gray-500 font-medium opacity-80">
                You have a session coming up shortly. Have a wonderful day!
            </p>
        </div>
    );
}
