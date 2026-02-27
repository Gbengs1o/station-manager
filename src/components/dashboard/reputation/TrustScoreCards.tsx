'use client';

import { Star, Fuel, Gauge } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

interface TrustScoreCardsProps {
    meterRating: number;
    totalReviews: number;
    totalReports?: number;
    overallRating?: string;
    isVerified?: boolean;
}

export default function TrustScoreCards({ meterRating, totalReviews, totalReports, overallRating, isVerified }: TrustScoreCardsProps) {
    const displayRating = overallRating || meterRating.toFixed(1);
    const combinedMeterCount = (totalReports || 0) + totalReviews;

    // Parse the numeric value for stars/logic (handle "100%" or "4.5")
    const numericRating = typeof displayRating === 'string' && displayRating.endsWith('%')
        ? (parseFloat(displayRating) / 100) * 5
        : parseFloat(displayRating.toString());

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
                <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <Star size={24} />
                </div>
                <div className={styles.statLabel}>Station Trust Score</div>
                <div className={styles.statValue}>
                    {displayRating}
                    {!displayRating.toString().includes('%') && (
                        <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 5.0</span>
                    )}
                </div>
                <div className={styles.statChange} style={{ color: numericRating >= 4.0 ? '#22c55e' : '#eab308' }}>
                    {numericRating >= 4.5 ? 'Excellent Reputation' : numericRating >= 3.5 ? 'Good Reputation' : 'Needs Improvement'}
                </div>
                <div className={styles.starRow}>
                    {renderStars(numericRating)}
                </div>
            </div>

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
                    {combinedMeterCount > 0 ? `Based on ${combinedMeterCount} checks` : 'Initial Baseline'}
                </div>
            </div>
        </div>
    );
}
