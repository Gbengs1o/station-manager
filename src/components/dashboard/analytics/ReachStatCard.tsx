'use client';

import React, { useState } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { Users, ChevronRight } from 'lucide-react';
import ReachDetailsModal from './ReachDetailsModal';
import { motion } from 'framer-motion';

interface ReachStatCardProps {
    communityReach: number;
    totalFavourites: number;
    details: {
        uniqueDrivers: number;
        newcomers: number;
        breakdown: {
            views: number;
            reports: number;
            favorites: number;
            reviews: number;
        };
    };
}

export default function ReachStatCard({ communityReach, totalFavourites, details }: ReachStatCardProps) {
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
                {/* Glow Effect on Hover */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                    <Users size={20} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>Community Reach</h3>
                    <ChevronRight size={14} style={{ opacity: 0.3 }} />
                </div>

                <p className={styles.statValue}>
                    {communityReach >= 1000 ? `${(communityReach / 1000).toFixed(1)}k` : communityReach.toLocaleString()}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span className={styles.statTrend} style={{ color: 'var(--primary)' }}>
                        {totalFavourites} driver favorites
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.4, fontStyle: 'italic' }}>Click for deep-dive</span>
                </div>
            </motion.div>

            <ReachDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stats={{
                    totalReach: communityReach,
                    ...details
                }}
            />
        </>
    );
}
