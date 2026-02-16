'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './AboutHero.module.css';

const images = [
    '/happy_manager/happy_manager.png',
    '/happy_manager/happy_manager2.png',
    '/happy_manager/happy_manager3.png',
    '/happy_manager/happy_manager4.png',
];

const AboutHero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { scrollY } = useScroll();

    // Parallax effect: Move background container slower than scroll
    const y = useTransform(scrollY, [0, 800], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0.5]);
    const scale = useTransform(scrollY, [0, 800], [1, 1.1]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 8000); // Increased to 8 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <section className={styles.hero}>
            <motion.div
                className={styles.parallaxContainer}
                style={{ y, scale }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={images[currentImageIndex]}
                        alt="Fynd Fuel Manager"
                        className={styles.bgImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }} // Matched CSS visibility
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5 }} // Slower cross-fade
                    />
                </AnimatePresence>
            </motion.div>

            <div className={styles.overlay} />

            <motion.div
                className={styles.content}
                style={{ opacity }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h1 className={styles.title}>
                    Empowering the <span className={styles.highlight}>Fuel Economy</span>
                </h1>
                <p className={styles.subtitle}>
                    Building transparency and trust between energy retailers and the modern consumer.
                </p>
            </motion.div>
        </section>
    );
};

export default AboutHero;
