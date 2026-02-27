'use client';

import React, { useState } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import VisitorsDetailsModal from './VisitorsDetailsModal';

interface VisitorsStatCardProps {
    totalVisits: number;
    avgPerDay: number;
    growth: number;
    dailyBreakdown: { date: string, visits: number }[];
}

export default function VisitorsStatCard({ totalVisits, avgPerDay, growth, dailyBreakdown }: VisitorsStatCardProps) {
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
                {/* Subtle Traffic Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    <Users size={20} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>Total Visitors</h3>
                    <ChevronRight size={14} style={{ opacity: 0.3 }} />
                </div>

                <p className={styles.statValue}>{totalVisits.toLocaleString()}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span className={styles.statTrend}>
                        Avg {avgPerDay.toLocaleString()}/day
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.4, fontStyle: 'italic' }}>Details</span>
                </div>
            </motion.div>

            <VisitorsDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stats={{
                    totalVisits,
                    avgPerDay,
                    growth,
                    dailyBreakdown
                }}
            />
        </>
    );
}
