'use client';

import { MapPin, ArrowRight, Fuel } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/dashboard/dashboard.module.css';

interface Competitor {
    id: number;
    name: string;
    brand: string;
    price_pms: number;
    distance: string;
}

interface CompetitorWatchProps {
    competitors: Competitor[];
    yourPrice: number;
}

export default function CompetitorWatch({ competitors, yourPrice }: CompetitorWatchProps) {
    return (
        <div className={styles.chartArea} style={{ border: '2px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)' }}>
            <div className={styles.sectionHeader} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.promoIcon} style={{ background: 'var(--primary)', width: '32px', height: '32px' }}>
                        <Fuel size={16} />
                    </div>
                    <h2 style={{ fontSize: '1.1rem' }}>Competitor Watch</h2>
                </div>
                <p style={{ fontSize: '0.85rem' }}>Prices of the 3 nearest stations.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {competitors.map((comp) => {
                    const priceDiff = comp.price_pms - yourPrice;
                    const isLower = priceDiff < 0;

                    return (
                        <div key={comp.id} className={styles.competitorCard} style={{
                            padding: '12px 16px',
                            background: 'var(--card-bg)',
                            borderLeft: isLower ? '3px solid #ef4444' : '3px solid #22c55e',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{comp.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={10} /> {comp.distance}
                                </span>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>₦{comp.price_pms}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isLower ? '#ef4444' : '#22c55e' }}>
                                    {isLower ? `-${Math.abs(priceDiff)}` : `+${priceDiff}`} vs You
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Link href="/dashboard/pricing" className={styles.viewAll} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                View Market Heatmap <ArrowRight size={14} />
            </Link>
        </div>
    );
}
