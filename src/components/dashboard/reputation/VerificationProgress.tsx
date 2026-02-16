'use client';

import { Award, CheckCircle2 } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

interface VerificationProgressProps {
    isVerified: boolean;
    points: number;
}

export default function VerificationProgress({ isVerified, points }: VerificationProgressProps) {
    const target = 1000;
    const percentage = Math.min((points / target) * 100, 100);

    return (
        <div className={styles.recentReports}>
            <div className={styles.sectionHeader}>
                <h2>Badge Status</h2>
                <p>Your journey to FyndFuel Gold Verified status.</p>
            </div>

            <div className={styles.statCard} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className={styles.promoIcon} style={{
                        width: '60px',
                        height: '60px',
                        background: isVerified ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--border)',
                        boxShadow: isVerified ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none'
                    }}>
                        <Award size={32} color={isVerified ? '#fff' : 'var(--text-secondary)'} />
                    </div>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            FyndFuel Gold {isVerified && <CheckCircle2 size={16} color="#22c55e" />}
                        </h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {isVerified ? 'You are a top-rated station' : 'Earn 1000 trust points to verify'}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                        <span>Progress: {points} / {target} pts</span>
                        <span>{percentage.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            background: 'linear-gradient(90deg, var(--primary), #a855f7)',
                            transition: 'width 1s ease-out'
                        }}></div>
                    </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Next Milestones:</p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: points > 200 ? '#22c55e' : 'var(--border)' }}></div>
                            Respond to 5 customer complaints (+100 pts)
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: points > 500 ? '#22c55e' : 'var(--border)' }}></div>
                            Maintain 4.5+ Meter Accuracy (+250 pts)
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: points > 800 ? '#22c55e' : 'var(--border)' }}></div>
                            Daily Price Updates for 7 days (+150 pts)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
