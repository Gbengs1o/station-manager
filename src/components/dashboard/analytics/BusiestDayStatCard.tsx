'use client';

import React, { useState } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BusiestDayDetailsModal from './BusiestDayDetailsModal';

interface BusiestDayStatCardProps {
    busiestDayLabel: string;
    peakVisits: number;
    peakHour: string;
    distribution: { period: string, volume: number }[];
}

export default function BusiestDayStatCard({ busiestDayLabel, peakVisits, peakHour, distribution }: BusiestDayStatCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02, translateY: -5 }}
                whileTap={{ scale: 0.98 }}
                className={styles.statCard}
                onClick={() => setIsModalOpen(true)}
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
                {/* Subtle Peak Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div className={styles.statIcon} style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                    <Clock size={20} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>Busiest Day</h3>
                    <ChevronRight size={14} style={{ opacity: 0.3 }} />
                </div>

                <p className={styles.statValue} style={{ fontSize: '1.5rem' }}>{busiestDayLabel}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span className={styles.statTrend}>
                        {peakVisits.toLocaleString()} visitors
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.4, fontStyle: 'italic' }}>Operational Advice</span>
                </div>
            </motion.div>

            <BusiestDayDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stats={{
                    busiestDay: busiestDayLabel,
                    peakVisits,
                    peakHour,
                    distribution
                }}
            />
        </>
    );
}
