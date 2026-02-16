import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { Logo } from './Icons';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show public navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <Logo className={styles.logoSvg} />
          <motion.span whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
            FyndFuel Manager
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className={styles.authLinks}>
          <ThemeToggle />
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/register" className="btn-primary">Get Started</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Drawer */}
        <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileNavLinks}>
            <Link href="/" onClick={toggleMenu}>Home</Link>
            <Link href="/about" onClick={toggleMenu}>About</Link>
            <Link href="/contact" onClick={toggleMenu}>Contact</Link>
          </div>

          <div className={styles.mobileAuthLinks}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <ThemeToggle />
            </div>
            <Link href="/login" className={styles.loginBtn} onClick={toggleMenu}>Login</Link>
            <Link href="/register" className="btn-primary" onClick={toggleMenu}>Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
