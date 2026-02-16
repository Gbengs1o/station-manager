'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { Logo } from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Navbar = () => {
  const pathname = usePathname();

  // Don't show public navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Logo className={styles.logoSvg} />
          <motion.span whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
            FyndFuel Manager
          </motion.span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className={styles.authLinks}>
          <ThemeToggle />
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/register" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
