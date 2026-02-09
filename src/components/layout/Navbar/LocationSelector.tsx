import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
    className?: string;
}

export function LocationSelector({ className }: LocationSelectorProps) {
    const { user } = useAuth();
    
    // Get address from profile or user data
    // Priority: address -> city/state -> fallback
    const address = React.useMemo(() => {
        if (!user?.profiles) return 'Set Location';
        
        const { address } = user.profiles;
        
        if (address) {
            // Keep it short for the navbar
            return address.length > 25 ? `${address.substring(0, 22)}...` : address;
        }
        
        return 'Set Location';
    }, [user]);

    return (
        <button 
            className={cn(
                "hidden md:flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-white/40 backdrop-blur-md border border-white/50 shadow-sm",
                "text-sm font-medium text-dashboard-text-primary",
                "hover:bg-white/60 transition-colors",
                className
            )}
        >
            <MapPin className="w-4 h-4 text-dashboard-accent-start" />
            <span className="max-w-[150px] truncate">{address}</span>
            <ChevronDown className="w-3 h-3 text-dashboard-text-secondary opacity-50" />
        </button>
    );
}
