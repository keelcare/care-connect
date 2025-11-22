"use client";

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Toggle } from '@/components/ui/Toggle';
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider';

export const FilterSidebar: React.FC = () => {
    const [services, setServices] = useState({
        childCare: false,
        seniorCare: false,
        petCare: false,
        housekeeping: false,
        tutoring: false,
        specialNeeds: false,
    });

    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([15, 50]);

    const handleServiceChange = (key: keyof typeof services) => {
        setServices(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <aside className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 space-y-8">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-neutral-900">Service Type</h3>
                    <button
                        className="text-xs font-medium text-primary hover:text-primary-600 transition-colors"
                        onClick={() => setServices({
                            childCare: false,
                            seniorCare: false,
                            petCare: false,
                            housekeeping: false,
                            tutoring: false,
                            specialNeeds: false,
                        })}
                    >
                        Clear
                    </button>
                </div>
                <div className="space-y-3">
                    <Checkbox
                        label="Child Care"
                        checked={services.childCare}
                        onChange={() => handleServiceChange('childCare')}
                    />
                    <Checkbox
                        label="Senior Care"
                        checked={services.seniorCare}
                        onChange={() => handleServiceChange('seniorCare')}
                    />
                    <Checkbox
                        label="Pet Care"
                        checked={services.petCare}
                        onChange={() => handleServiceChange('petCare')}
                    />
                    <Checkbox
                        label="Housekeeping"
                        checked={services.housekeeping}
                        onChange={() => handleServiceChange('housekeeping')}
                    />
                    <Checkbox
                        label="Tutoring"
                        checked={services.tutoring}
                        onChange={() => handleServiceChange('tutoring')}
                    />
                    <Checkbox
                        label="Special Needs"
                        checked={services.specialNeeds}
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
                    initialMin={priceRange[0]}
                    initialMax={priceRange[1]}
                    onChange={setPriceRange}
                />
            </div>

            <div className="h-px bg-neutral-100"></div>

            <div>
                <h3 className="font-bold text-neutral-900 mb-4">Verification</h3>
                <Toggle
                    label="Background Checked Only"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
            </div>
        </aside>
    );
};
