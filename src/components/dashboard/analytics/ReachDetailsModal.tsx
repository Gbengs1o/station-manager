'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, UserPlus, Heart, Zap, MousePointer2, PieChart } from 'lucide-react';

interface ReachDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        totalReach: number;
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

export default function ReachDetailsModal({ isOpen, onClose, stats }: ReachDetailsModalProps) {
    if (!isOpen) return null;

    const loyaltyRate = stats.uniqueDrivers > 0
        ? Math.round(((stats.totalReach - stats.breakdown.views) / stats.uniqueDrivers) * 10) / 10
        : 0;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)'
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',
                        background: 'var(--card-bg)',
                        borderRadius: '28px',
                        border: '1px solid var(--border)',
                        padding: '32px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'var(--border)',
                            border: 'none',
                            color: 'var(--text-primary)',
                            padding: '8px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
                                <PieChart size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Community Deep-Dive</h2>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Detailed breakdown of driver interaction patterns over the last 7 days.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <Users size={14} /> Unique Drivers
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.uniqueDrivers}</div>
                            <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>Verified individuals</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <UserPlus size={14} /> New Commuters
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.newcomers}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px' }}>First time this week</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: '20px', opacity: 0.8 }}>Interaction Component Analysis</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        <BreakdownRow
                            label="App Profile Views"
                            count={stats.breakdown.views}
                            total={stats.totalReach}
                            icon={<MousePointer2 size={16} />}
                            color="var(--text-secondary)"
                        />
                        <BreakdownRow
                            label="Driver Price Reports"
                            count={stats.breakdown.reports}
                            total={stats.totalReach}
                            icon={<Zap size={16} />}
                            color="#f97316"
                        />
                        <BreakdownRow
                            label="Station Favorites"
                            count={stats.breakdown.favorites}
                            total={stats.totalReach}
                            icon={<Heart size={16} />}
                            color="#ef4444"
                        />
                        <BreakdownRow
                            label="User Feedback/Reviews"
                            count={stats.breakdown.reviews}
                            total={stats.totalReach}
                            icon={<Users size={16} />}
                            color="#a855f7"
                        />
                    </div>

                    <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 600 }}>Driver Loyalty Ratio</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{loyaltyRate}x</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            On average, each verified driver interacts with your station <strong>{loyaltyRate} times</strong> per week. This indicates strong repeat visits and trust in your price reporting.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function BreakdownRow({ label, count, total, icon, color }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                    <div style={{ color }}>{icon}</div>
                    <span>{label}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{count.toLocaleString()}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    style={{ height: '100%', background: color || 'var(--primary)' }}
                />
            </div>
        </div>
    );
}
