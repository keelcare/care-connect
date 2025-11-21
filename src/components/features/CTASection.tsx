import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './CTASection.module.css';

export const CTASection: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Ready to Find the Perfect Care?</h2>
                    <p className={styles.description}>
                        Join thousands of families who trust CareConnect for their loved ones.
                        Sign up today and get started for free.
                    </p>
                    <div className={styles.buttons}>
                        <Link href="/auth/signup">
                            <Button size="lg" style={{ backgroundColor: 'white', color: 'var(--color-primary-600)' }}>
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/how-it-works">
                            <Button variant="secondary" size="lg" style={{ borderColor: 'white', color: 'white' }}>
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className={styles.imageContainer}>
                    <div className={styles.overlay} />
                </div>
            </div>
        </section>
    );
};
