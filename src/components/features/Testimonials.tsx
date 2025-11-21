import React from 'react';
import { TestimonialCard } from './TestimonialCard';
import styles from './Testimonials.module.css';

export const Testimonials: React.FC = () => {
    const testimonials = [
        {
            quote: "Finding a nanny for our twins was stressful until we found CareConnect. The background checks gave us peace of mind, and Sarah is amazing!",
            authorName: "Jennifer M.",
            authorRole: "Parent of Twins",
            authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        },
        {
            quote: "I needed someone to look after my dad while I'm at work. The caregivers here are so professional and kind. It's been a lifesaver.",
            authorName: "David K.",
            authorRole: "Son of Senior",
            authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        },
        {
            quote: "As a pet sitter, I love how easy it is to find clients and manage my schedule. The platform is super user-friendly.",
            authorName: "Jessica T.",
            authorRole: "Pet Care Provider",
            authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Trusted by Families</h2>
                    <p className={styles.subtitle}>
                        Hear from families and caregivers who have found their perfect match on CareConnect.
                    </p>
                </div>
                <div className={styles.grid}>
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            {...testimonial}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
