import React from 'react';
import Link from 'next/link';
import { Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <Heart fill="currentColor" size={24} />
                            CareConnect
                        </Link>
                        <p className={styles.description}>
                            Connecting families with trusted caregivers for child care, senior care, pet care, and more.
                        </p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.column}>
                            <h3 className={styles.heading}>For Families</h3>
                            <ul className={styles.linkList}>
                                <li><Link href="/search" className={styles.link}>Find Care</Link></li>
                                <li><Link href="/how-it-works" className={styles.link}>How it Works</Link></li>
                                <li><Link href="/safety" className={styles.link}>Safety</Link></li>
                                <li><Link href="/pricing" className={styles.link}>Pricing</Link></li>
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h3 className={styles.heading}>For Caregivers</h3>
                            <ul className={styles.linkList}>
                                <li><Link href="/jobs" className={styles.link}>Find Jobs</Link></li>
                                <li><Link href="/resources" className={styles.link}>Resources</Link></li>
                                <li><Link href="/insurance" className={styles.link}>Insurance</Link></li>
                                <li><Link href="/success-stories" className={styles.link}>Success Stories</Link></li>
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h3 className={styles.heading}>Company</h3>
                            <ul className={styles.linkList}>
                                <li><Link href="/about" className={styles.link}>About Us</Link></li>
                                <li><Link href="/careers" className={styles.link}>Careers</Link></li>
                                <li><Link href="/blog" className={styles.link}>Blog</Link></li>
                                <li><Link href="/contact" className={styles.link}>Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} CareConnect. All rights reserved.
                    </p>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialLink} aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" className={styles.socialLink} aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" className={styles.socialLink} aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" className={styles.socialLink} aria-label="LinkedIn"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
