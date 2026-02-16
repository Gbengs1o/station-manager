'use client';

import { Star, Fuel, Gauge } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

interface TrustScoreProps {
    meterRating: number;
    qualityRating: number;
    totalReviews: number;
}

export default function TrustScoreCards({ meterRating, qualityRating, totalReviews }: TrustScoreProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={16}
                fill={i < Math.round(rating) ? 'var(--primary)' : 'none'}
                stroke={i < Math.round(rating) ? 'var(--primary)' : 'var(--text-secondary)'}
            />
        ));
    };

    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--primary)' }}>
                    <Gauge size={24} />
                </div>
                <div className={styles.statLabel}>Meter Accuracy</div>
                <div className={styles.statValue}>{meterRating > 0 ? meterRating.toFixed(1) : 'N/A'}</div>
                <div className={styles.starRow}>
                    {meterRating > 0 ? renderStars(meterRating) : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Waiting for feedback</span>}
                </div>
                <div className={styles.statChange} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {totalReviews > 0 ? `Based on ${totalReviews} reports` : 'No reviews recorded'}
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    <Fuel size={24} />
                </div>
                <div className={styles.statLabel}>Fuel Quality</div>
                <div className={styles.statValue}>{qualityRating > 0 ? qualityRating.toFixed(1) : 'N/A'}</div>
                <div className={styles.starRow}>
                    {qualityRating > 0 ? renderStars(qualityRating) : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No data yet</span>}
                </div>
                <div className={styles.statChange} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {totalReviews > 0 ? 'Verified by users' : 'Encourage users to rate'}
                </div>
            </div>
        </div>
    );
}
