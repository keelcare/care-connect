"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './ServiceCard.module.css';

export interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactElement;
    gradient?: string;
    onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    description,
    icon,
    gradient,
    onClick,
}) => {
    return (
        <div className={styles.card} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div
                className={styles.iconContainer}
                style={gradient ? { background: gradient } : undefined}
            >
                {React.cloneElement(icon, { size: 40 } as React.Attributes)}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.cta}>
                    <Button variant="text" className={styles.button} onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}>
                        Learn More <ArrowRight size={16} style={{ marginLeft: 8 }} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
