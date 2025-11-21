"use client";

import React from 'react';
import { Baby, Heart, Dog, Home, BookOpen, Activity } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import styles from './FeaturedServices.module.css';

export const FeaturedServices: React.FC = () => {
    const services = [
        {
            title: "Child Care",
            description: "Trusted nannies, babysitters, and au pairs for children of all ages.",
            icon: <Baby />,
            gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
        },
        {
            title: "Senior Care",
            description: "Compassionate caregivers for companionship, personal care, and medical support.",
            icon: <Heart />,
            gradient: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
        },
        {
            title: "Pet Care",
            description: "Reliable pet sitters, dog walkers, and groomers for your furry friends.",
            icon: <Dog />,
            gradient: "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
        },
        {
            title: "Housekeeping",
            description: "Professional cleaners for regular maintenance, deep cleaning, and organization.",
            icon: <Home />,
            gradient: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
        },
        {
            title: "Tutoring",
            description: "Expert tutors for academic support, test prep, and skill development.",
            icon: <BookOpen />,
            gradient: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        },
        {
            title: "Special Needs",
            description: "Specialized care for individuals with diverse abilities and needs.",
            icon: <Activity />,
            gradient: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Care for Every Need</h2>
                    <p className={styles.subtitle}>
                        Whether you need a nanny, a senior caregiver, or someone to walk the dog, we have you covered.
                    </p>
                </div>
                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            title={service.title}
                            description={service.description}
                            icon={service.icon}
                            gradient={service.gradient}
                            onClick={() => console.log(`Clicked ${service.title}`)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
