import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
                            <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-100 shadow-lg">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/how-it-works">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
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
