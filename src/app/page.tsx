'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

import InfiniteMarquee from '@/components/InfiniteMarquee';

const images = [
  '/happy_manager/happy_manager.png',
  '/happy_manager/happy_manager2.png',
  '/happy_manager/happy_manager3.png',
  '/happy_manager/happy_manager4.png',
];

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={`container ${styles.heroContainer}`}>
        <motion.div
          className={styles.heroContent}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h1 className={styles.title} variants={fadeIn}>
            The Ultimate Dashboard for <span className={styles.highlight}>Fuel Station Managers</span>
          </motion.h1>
          <motion.p className={styles.description} variants={fadeIn}>
            Monitor fuel prices, manage customer reviews, and grow your station&apos;s reputation with Fynd Fuel.
            Join thousands of managers across the country.
          </motion.p>
          <motion.div className={styles.ctaGroup} variants={fadeIn}>
            <Link href="/register" className="btn-primary">
              Register Your Station
            </Link>
            <Link href="/about" className={styles.btnSecondary}>
              Learn More
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.heroImage}
          initial={{ opacity: 0, x: 50, rotateY: 20 }}
          whileInView={{ opacity: 1, x: 0, rotateY: -10 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.heroImageContainer}>
            <video
              src="/happy_manager/happy_manager.video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className={styles.heroImg}
            />
          </div>

        </motion.div>
      </div >

      <section className={styles.marqueeSection}>
        <InfiniteMarquee images={images} />
      </section>

      <section className={styles.features}>
        <div className="container">
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose Fynd Fuel?
          </motion.h2>
          <motion.div
            className={styles.featureGrid}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { icon: "📊", title: "Real-time Tracking", desc: "Keep your prices competitive with automated market tracking." },
              { icon: "💬", title: "Customer Engagement", desc: "Respond to reviews and build trust with your local community." },
              { icon: "🚀", title: "Station Growth", desc: "Get featured and attract more customers using our promotional tools." }
            ].map((feature, i) => (
              <motion.div key={i} className={styles.featureCard} variants={fadeIn}>
                <div className={styles.icon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div >
  );
}
