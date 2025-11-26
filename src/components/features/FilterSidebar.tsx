"use client";

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Toggle } from '@/components/ui/Toggle';
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider';
import {
    Baby,
    User,
    Dog,
    Home,
    BookOpen,
    Heart,
    ShieldCheck,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
    services: {
        childCare: boolean;
        seniorCare: boolean;
        petCare: boolean;
        housekeeping: boolean;
        tutoring: boolean;
        specialNeeds: boolean;
    };
    verifiedOnly: boolean;
    priceRange: [number, number];
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (newFilters: FilterState) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {

    const handleServiceChange = (key: keyof typeof filters.services) => {
        onFilterChange({
            ...filters,
            services: {
                ...filters.services,
                [key]: !filters.services[key]
            }
        });
    };

    const handlePriceChange = (newRange: [number, number]) => {
        onFilterChange({
            ...filters,
            priceRange: newRange
        });
    };

    const handleVerifiedChange = (checked: boolean) => {
        onFilterChange({
            ...filters,
            verifiedOnly: checked
        });
    };

    const clearServices = () => {
        onFilterChange({
            ...filters,
            services: {
                childCare: false,
                seniorCare: false,
                petCare: false,
                housekeeping: false,
                tutoring: false,
                specialNeeds: false,
            }
        });
    };

    return (
        <aside className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 space-y-8 h-full overflow-y-auto custom-scrollbar">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Service Type</h3>
                    <button
                        className="text-xs font-medium text-primary hover:text-primary-600 transition-colors"
                        onClick={clearServices}
                    >
                        Clear
                    </button>
                </div>
                <div className="space-y-3">
                    <Checkbox
                        label="Child Care"
                        checked={filters.services.childCare}
                        onChange={() => handleServiceChange('childCare')}
                    />
                    <Checkbox
                        label="Senior Care"
                        checked={filters.services.seniorCare}
                        onChange={() => handleServiceChange('seniorCare')}
                    />
                    <Checkbox
                        label="Pet Care"
                        checked={filters.services.petCare}
                        onChange={() => handleServiceChange('petCare')}
                    />
                    <Checkbox
                        label="Housekeeping"
                        checked={filters.services.housekeeping}
                        onChange={() => handleServiceChange('housekeeping')}
                    />
                    <Checkbox
                        label="Tutoring"
                        checked={filters.services.tutoring}
                        onChange={() => handleServiceChange('tutoring')}
                    />
                    <Checkbox
                        label="Special Needs"
                        checked={filters.services.specialNeeds}
                        onChange={() => handleServiceChange('specialNeeds')}
                    />
                </div>
            </div>

            <div className="h-px bg-neutral-100"></div>

            <div>
                <h3 className="font-bold text-neutral-900 mb-4">Hourly Rate</h3>
                <PriceRangeSlider
                    min={10}
                    max={100}
                    initialMin={filters.priceRange[0]}
                    initialMax={filters.priceRange[1]}
                    onChange={handlePriceChange}
                />
            </div>

            <div className="h-px bg-neutral-100"></div>

            <div>
                <h3 className="font-bold text-neutral-900 mb-4">Verification</h3>
                <Toggle
                    label="Background Checked Only"
                    checked={filters.verifiedOnly}
                    onChange={(e) => handleVerifiedChange(e.target.checked)}
                />
            </div>
        </aside>
    );
};
