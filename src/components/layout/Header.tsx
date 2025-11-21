"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './Header.module.css';

export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Heart fill="currentColor" size={24} />
                    CareConnect
                </Link>

                <nav className={styles.nav}>
                    <ul className={styles.navLinks}>
                        <li><Link href="/search" className={styles.navLink}>Find Care</Link></li>
                        <li><Link href="/jobs" className={styles.navLink}>Find Jobs</Link></li>
                        <li><Link href="/how-it-works" className={styles.navLink}>How it Works</Link></li>
                    </ul>
                </nav>

                <div className={styles.authButtons}>
                    <Link href="/auth/login">
                        <Button variant="text" size="sm">Log In</Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button variant="primary" size="sm">Sign Up</Button>
                    </Link>
                </div>

                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
};
