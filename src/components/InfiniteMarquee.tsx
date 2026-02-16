'use client';

import { motion } from 'framer-motion';
import styles from './InfiniteMarquee.module.css';

interface InfiniteMarqueeProps {
    images: string[];
    speed?: number;
}

const InfiniteMarquee = ({ images, speed = 40 }: InfiniteMarqueeProps) => {
    // Triple the images to ensure a smooth loop even for large screens
    const doubledImages = [...images, ...images, ...images];

    return (
        <div className={styles.marquee}>
            <motion.div
                className={styles.track}
                animate={{
                    x: [0, -1680], // Approximate width of one image set + gaps
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
            >
                {doubledImages.map((src, index) => (
                    <div key={index} className={styles.imageWrapper}>
                        <img src={src} alt={`Manager ${index}`} className={styles.image} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default InfiniteMarquee;
