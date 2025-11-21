"use client";

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Toggle } from '@/components/ui/Toggle';
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider';
import styles from './FilterSidebar.module.css';

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
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.title}>Service Type</h3>
                    <button
                        className={styles.clearBtn}
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
                <div className={styles.group}>
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

            <hr className={styles.divider} />

            <div className={styles.section}>
                <h3 className={styles.title}>Hourly Rate</h3>
                <PriceRangeSlider
                    min={10}
                    max={100}
                    initialMin={priceRange[0]}
                    initialMax={priceRange[1]}
                    onChange={setPriceRange}
                />
            </div>

            <hr className={styles.divider} />

            <div className={styles.section}>
                <h3 className={styles.title}>Verification</h3>
                <Toggle
                    label="Background Checked Only"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
            </div>
        </aside>
    );
};
