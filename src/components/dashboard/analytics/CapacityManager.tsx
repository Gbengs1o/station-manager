'use client';

import React, { useState } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { createClient } from '@/utils/supabase/client';
import { Settings, Info, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CapacityManagerProps {
    stationId: string | number;
    initialCapacity: number;
    peakVisits: number;
}

export default function CapacityManager({ stationId, initialCapacity, peakVisits }: CapacityManagerProps) {
    const [capacity, setCapacity] = useState(initialCapacity || 500);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const supabase = createClient();

    const usagePercentage = capacity > 0 ? Math.min(Math.round((peakVisits / capacity) * 100), 100) : 0;

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('stations')
            .update({ max_daily_capacity: capacity })
            .eq('id', stationId);

        setIsSaving(false);
        if (!error) {
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    return (
        <div className={styles.loyaltyItem} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Station Capacity Usage</span>
                        <div className={styles.tooltip_container} style={{ position: 'relative', display: 'inline-block' }}>
                            <Info size={14} style={{ color: 'var(--text-secondary)', cursor: 'help' }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '125%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '220px',
                                background: 'rgba(23, 23, 23, 0.95)',
                                backdropFilter: 'blur(8px)',
                                padding: '12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                color: 'white',
                                zIndex: 10,
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                pointerEvents: 'none',
                                opacity: 0,
                                visibility: 'hidden',
                                transition: 'all 0.2s ease'
                            }} className="tooltip_text">
                                <strong>What is this?</strong><br />
                                This measures how much of your station's total capacity is being used based on your peak daily visitors.
                                <br /><br />
                                <strong>How to set capacity?</strong><br />
                                Input the maximum number of drivers your station can handle in a single 24-hour period (e.g., number of pumps × average cars per hour × hours open).
                            </div>
                            <style jsx>{`
                                .tooltip_container:hover .tooltip_text {
                                    opacity: 1;
                                    visibility: visible;
                                }
                            `}</style>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '200px' }}>
                        Based on your max capacity of <strong>{capacity}</strong>.
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: usagePercentage > 80 ? '#ef4444' : usagePercentage > 50 ? '#f97316' : '#22c55e' }}>
                        {usagePercentage}%
                    </span>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: 'rgba(168, 85, 247, 0.1)'
                        }}
                    >
                        <Settings size={12} /> {isEditing ? 'Cancel' : 'Configure Capacity'}
                    </button>
                </div>
            </div>

            <div className={styles.barWrap} style={{ background: 'var(--border)', height: '10px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    className={styles.bar}
                    style={{
                        height: '100%',
                        background: usagePercentage > 80 ? '#ef4444' : '#22c55e'
                    }}
                ></motion.div>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ marginTop: '16px', overflow: 'hidden' }}
                    >
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border)'
                        }}>
                            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                Set Max Daily Capacity (Drivers/Day)
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="number"
                                    value={capacity}
                                    onChange={(e) => setCapacity(Number(e.target.value))}
                                    style={{
                                        flex: 1,
                                        background: 'var(--background)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        opacity: isSaving ? 0.7 : 1
                                    }}
                                >
                                    {isSaving ? '...' : <><Save size={16} /> Save</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            marginTop: '12px',
                            color: '#22c55e',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center'
                        }}
                    >
                        <Check size={14} /> Capacity updated successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
