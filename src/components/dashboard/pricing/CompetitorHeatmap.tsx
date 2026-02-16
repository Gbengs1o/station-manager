'use client';

import { useState } from 'react';
import { MapPin, Zap } from 'lucide-react';
import { getStationDetails } from '@/app/dashboard/pricing/actions';
import StationDetailsModal from './StationDetailsModal';
import styles from '@/app/dashboard/dashboard.module.css';

interface Competitor {
    id: number;
    name: string;
    brand: string;
    distance: string;
    price_pms: number;
}

interface CompetitorHeatmapProps {
    competitors: Competitor[];
    yourPrice: number;
}

export default function CompetitorHeatmap({ competitors, yourPrice }: CompetitorHeatmapProps) {
    const [selectedStation, setSelectedStation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleStationClick = async (stationId: number) => {
        setIsLoading(true);
        try {
            const details = await getStationDetails(stationId);
            setSelectedStation(details);
        } catch (error) {
            console.error('Failed to fetch station details:', error);
            alert('Could not load station profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.recentReports}>
                <div className={styles.sectionHeader}>
                    <h2>Competitor Intelligence</h2>
                    <p>Real-time pricing from the 5 nearest stations. Click to view profiles.</p>
                </div>

                <div className={styles.competitorList}>
                    {competitors.map((comp) => {
                        const priceDiff = comp.price_pms - yourPrice;
                        const isLower = priceDiff < 0;

                        return (
                            <div
                                key={comp.id}
                                className={`${styles.competitorCard} ${styles.clickable}`}
                                style={{ borderLeft: isLower ? '3px solid #ef4444' : '3px solid #22c55e' }}
                                onClick={() => handleStationClick(comp.id)}
                            >
                                <div className={styles.compInfo}>
                                    <div className={styles.compMainInfo}>
                                        <strong>{comp.name}</strong>
                                        <span className={styles.brandBadge}>{comp.brand}</span>
                                    </div>
                                    <span className={styles.distanceInfo}>
                                        <MapPin size={12} /> {comp.distance}
                                    </span>
                                </div>

                                <div className={styles.compPrice}>
                                    <span className={styles.priceLabel}>PMS Price</span>
                                    <span className={styles.priceVal}>₦{comp.price_pms}</span>
                                    <div className={`${styles.priceComparison} ${isLower ? styles.lower : styles.higher}`}>
                                        {isLower ? `-${Math.abs(priceDiff)}` : `+${priceDiff}`} vs You
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {competitors.some(c => c.price_pms < yourPrice) && (
                    <div className={styles.strategyBox}>
                        <p className={styles.strategyTitle}>
                            <Zap size={16} /> Strategy Suggestion
                        </p>
                        <p className={styles.strategyText}>
                            A competitor just dropped PMS to ₦{Math.min(...competitors.map(c => c.price_pms))}. Match them to retain your traffic!
                        </p>
                    </div>
                )}
            </div>

            <StationDetailsModal
                station={selectedStation}
                onClose={() => setSelectedStation(null)}
            />

            {isLoading && (
                <div className={styles.modalOverlay} style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>Loading Profile...</div>
                </div>
            )}
        </>
    );
}
