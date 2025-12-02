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
    DollarSign,
    RotateCcw
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

    const resetAllFilters = () => {
        onFilterChange({
            services: {
                childCare: false,
                seniorCare: false,
                petCare: false,
                housekeeping: false,
                tutoring: false,
                specialNeeds: false,
            },
            priceRange: [0, 2000],
        });
    };

    // Calculate active filter count
    const activeServiceCount = Object.values(filters.services).filter(Boolean).length;
    const isPriceChanged = filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000;
    const activeFilterCount = activeServiceCount + (isPriceChanged ? 1 : 0);

    return (
        <aside className="bg-white rounded-2xl border border-stone-200 shadow-lg shadow-stone-200/50 p-6 space-y-6 h-full overflow-y-auto custom-scrollbar">
            {/* Header with Reset All */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                    <h2 className="font-bold text-lg text-stone-900">Filters</h2>
                    {activeFilterCount > 0 && (
                        <p className="text-xs text-stone-500 mt-1">
                            {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                        </p>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button
                        className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-100"
                        onClick={resetAllFilters}
                    >
                        <RotateCcw size={14} />
                        Reset All
                    </button>
                )}
            </div>

            {/* Service Type Section */}
            <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-900 text-sm">Service Type</h3>
                    {activeServiceCount > 0 && (
                        <button
                            className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                            onClick={clearServices}
                        >
                            Clear
                        </button>
                    )}
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

            {/* Hourly Rate Section */}
            <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign size={16} className="text-stone-700" />
                    <h3 className="font-bold text-stone-900 text-sm">Hourly Rate</h3>
                </div>
                <PriceRangeSlider
                    min={0}
                    max={2000}
                    initialMin={filters.priceRange[0]}
                    initialMax={filters.priceRange[1]}
                    onChange={handlePriceChange}
                />
            </div>


        </aside>
    );
};
