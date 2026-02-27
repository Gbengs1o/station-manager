'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sun, Moon, Zap, AlertTriangle, Lightbulb, Coffee } from 'lucide-react';

interface BusiestDayDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: {
        busiestDay: string;
        peakVisits: number;
        peakHour: string; // e.g., "08:00 AM"
        distribution: { period: string, volume: number }[]; // Morning, Afternoon, Evening
    };
}

export default function BusiestDayDetailsModal({ isOpen, onClose, stats }: BusiestDayDetailsModalProps) {
    if (!isOpen) return null;

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
                            <div style={{ padding: '10px', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', borderRadius: '12px' }}>
                                <Clock size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Peak Demand Analysis</h2>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Operational insights for your busiest windows.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <Zap size={14} /> Peak Hour
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.peakHour}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>Highest traffic intensity</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <Coffee size={14} /> Peak Volume
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.peakVisits}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>Visitors on {stats.busiestDay}</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: '20px', opacity: 0.8 }}>Time of Day Distribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        {stats.distribution.map((item, i) => {
                            const max = Math.max(...stats.distribution.map(d => d.volume), 1);
                            const width = `${(item.volume / max) * 100}%`;
                            const icons = [<Sun size={16} key="m" />, <Sun size={16} color="#f97316" key="a" />, <Moon size={16} key="e" />];
                            const labels = ["Morning (06:00 - 12:00)", "Afternoon (12:00 - 18:00)", "Evening (18:00 - 00:00)"];

                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                            {icons[i]}
                                            <span>{labels[i]}</span>
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.volume} visits</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width }}
                                            style={{ height: '100%', background: i === 1 ? '#f97316' : 'var(--text-secondary)', opacity: 0.8 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{
                        background: 'rgba(249, 115, 22, 0.05)',
                        padding: '24px',
                        borderRadius: '24px',
                        border: '1px solid rgba(249, 115, 22, 0.1)',
                        display: 'flex',
                        gap: '16px'
                    }}>
                        <div style={{ color: '#f97316', paddingTop: '4px' }}><Lightbulb size={24} /></div>
                        <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>Operational Strategy</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Your station peaks during <strong>{stats.peakHour.includes('AM') ? 'morning commutes' : 'evening rushes'}</strong>. Ensuring all pumps are active and staff is fully deployed between <strong>{stats.peakHour}</strong> can reduce wait times and improve your conversion efficiency.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
