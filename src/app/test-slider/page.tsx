"use client";

import React from 'react';
import { Slider } from '@/components/ui/slider';

export default function TestSliderPage() {
    return (
        <div className="p-10">
            <h1>Test Slider</h1>
            <Slider defaultValue={[50]} max={100} step={1} className="w-[200px]" />
        </div>
    );
}
