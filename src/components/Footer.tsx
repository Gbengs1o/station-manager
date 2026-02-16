'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

const Footer = () => {
    const pathname = usePathname();

    // Don't show public footer on dashboard routes
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.footerBrand}>
                    <h2 className={styles.logo}>Fynd<span>Fuel</span></h2>
                    <p>Empowering station managers with real-time data and customer engagement tools.</p>
                </div>
                <div className={styles.footerLinks}>
                    <div>
                        <h3>Navigation</h3>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Legal</h3>
                        <ul>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; {new Date().getFullYear()} Fynd Fuel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
