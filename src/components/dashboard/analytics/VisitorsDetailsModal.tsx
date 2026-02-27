'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Users, BarChart3, Calendar, ArrowRight } from 'lucide-react';

interface VisitorsDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        totalVisits: number;
        avgPerDay: number;
        growth: number; // Percentage growth vs previous period
        dailyBreakdown: { date: string, visits: number }[];
    };
}

export default function VisitorsDetailsModal({ isOpen, onClose, stats }: VisitorsDetailsModalProps) {
    if (!isOpen) return null;

    const isPositive = stats.growth >= 0;

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
                            <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '12px' }}>
                                <BarChart3 size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Traffic Intelligence</h2>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Understanding your station's physical visitor volume.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <Calendar size={14} /> Weekly Growth
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: isPositive ? '#22c55e' : '#ef4444' }}>
                                    {isPositive ? '+' : ''}{stats.growth}%
                                </div>
                                {isPositive ? <TrendingUp size={20} color="#22c55e" /> : <TrendingDown size={20} color="#ef4444" />}
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>vs. previous 7 days</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <Users size={14} /> Daily Average
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.avgPerDay}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>Visitors per day</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: '20px', opacity: 0.8 }}>Daily Traffic Distribution</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '8px', marginBottom: '32px', padding: '0 10px' }}>
                        {stats.dailyBreakdown.map((day, i) => {
                            const max = Math.max(...stats.dailyBreakdown.map(d => d.visits), 1);
                            const height = `${(day.visits / max) * 100}%`;
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ fontSize: '10px', opacity: 0.6 }}>{day.visits}</div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height }}
                                        style={{
                                            width: '100%',
                                            background: i === stats.dailyBreakdown.length - 1 ? 'var(--primary)' : '#22c55e',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <div style={{ fontSize: '10px', fontWeight: 600, opacity: 0.8 }}>
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        background: 'rgba(34, 197, 94, 0.05)',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid rgba(34, 197, 94, 0.1)',
                        display: 'flex',
                        gap: '16px'
                    }}>
                        <div style={{ color: '#22c55e', paddingTop: '4px' }}><TrendingUp size={24} /></div>
                        <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>Growth Insight</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Your traffic is <strong>{isPositive ? 'trending upwards' : 'stabilizing'}</strong>. {isPositive ? 'Consider optimizing your pump staff during busiest days to maintain high conversion.' : 'Focus on refreshing your prices in the app to boost visitor interest.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
