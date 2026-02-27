'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, MapPin, TrendingUp, History, User } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

interface ScoutProfile {
    profile: any;
    reputation: number;
    totalReports: number;
    recentReports: any[];
}

interface ScoutProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ScoutProfile | null;
    isLoading: boolean;
}

export function getVehicleStatus(points: number) {
    if (points >= 5000) return { label: 'G-Wagon', icon: '🚙', color: '#3b82f6' };
    if (points >= 2000) return { label: 'Danfo', icon: '🚌', color: '#f59e0b' };
    if (points >= 500) return { label: 'Keke Napep', icon: '🛺', color: '#10b981' };
    return { label: 'Legedis Benz', icon: '🚶🏾‍♂️', color: '#9ca3af' };
}

export default function ScoutProfileModal({ isOpen, onClose, data, isLoading }: ScoutProfileModalProps) {
    if (!isOpen) return null;

    const vehicle = data ? getVehicleStatus(data.reputation) : null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.modalContent}
                    style={{ maxWidth: '450px' }}
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.modalHeader}>
                        <div className={styles.modalTitle}>
                            <Award className="text-primary" size={20} />
                            <h3 style={{ margin: 0 }}>Scout Profile</h3>
                        </div>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className={styles.modalBody} style={{ padding: '20px' }}>
                        {isLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <div className="animate-spin mb-4">⌛</div>
                                Loading contributor data...
                            </div>
                        ) : data ? (
                            <>
                                {/* Identity & Rank */}
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div className={styles.avatar} style={{
                                        width: '80px',
                                        height: '80px',
                                        fontSize: '32px',
                                        margin: '0 auto 16px',
                                        borderRadius: '24px'
                                    }}>
                                        {data.profile?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{data.profile?.full_name || 'Active Driver'}</h2>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 12px',
                                        background: `${vehicle?.color}20`,
                                        color: vehicle?.color,
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        <span>{vehicle?.icon}</span>
                                        <span>{vehicle?.label}</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    marginBottom: '24px'
                                }}>
                                    <div className={styles.detailCard} style={{ textAlign: 'center' }}>
                                        <TrendingUp size={16} className="mb-2" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{data.reputation.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reputation</div>
                                    </div>
                                    <div className={styles.detailCard} style={{ textAlign: 'center' }}>
                                        <MapPin size={16} className="mb-2" style={{ color: '#ec4899', margin: '0 auto' }} />
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{data.totalReports}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reports</div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <h4 style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <History size={14} /> Recent Contributions
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {data.recentReports.length > 0 ? data.recentReports.map((report) => (
                                            <div key={report.id} style={{
                                                padding: '10px 12px',
                                                background: 'rgba(255,255,255,0.02)',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                fontSize: '0.875rem'
                                            }}>
                                                <div style={{ fontWeight: 600, marginBottom: '2px' }}>{report.station_name}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                    <span>Verified at ₦{report.price}</span>
                                                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                No recent activity found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                User profile could not be loaded.
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
