'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, Target, TrendingUp, BarChart2, Users, Zap } from 'lucide-react';

export default function DashboardEducation() {
    const [isExpanded, setIsExpanded] = useState(false);

    const metrics = [
        {
            title: 'Trust Score',
            icon: <Target size={18} />,
            color: '#3b82f6',
            description: 'A 0-100% reputation metric weighted by: **40% Meter Accuracy** (based on price reports), **40% User Reviews**, and **20% Verification Status**.'
        },
        {
            title: 'Market Average',
            icon: <TrendingUp size={18} />,
            color: '#fbbf24',
            description: 'Real-time average of your **3 nearest competitors**. If neighbors haven\'t updated prices, we fallback to the **Official State Price** to keep insights accurate.'
        },
        {
            title: 'Revenue Projections',
            icon: <BarChart2 size={18} />,
            color: '#a855f7',
            description: 'Estimated earnings based on local pump prices multiplied by your **Weighted Visit Index** (a mix of loyalty and new driver discovery).'
        },
        {
            title: 'Daily Customers',
            icon: <Users size={18} />,
            color: '#22c55e',
            description: 'The number of unique drivers who engaged with your station in the FyndFuel app (views, navigation requests, or check-ins) in the last 24 hours.'
        }
    ];

    const parseDescription = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: '#fff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                marginBottom: '24px',
                backdropFilter: 'blur(20px)',
                width: '100%',
                position: 'relative',
                zIndex: 10,
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                alignSelf: 'start'
            }}
        >
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ background: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.995 }}
                style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#fff',
                    outline: 'none',
                    textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
                        color: '#60a5fa',
                        padding: '12px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.1)'
                    }}>
                        <Info size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>Understanding Your Data</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                            Learn how we calculate your station&apos;s performance metrics.
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.span
                        animate={{ opacity: isExpanded ? 0.6 : 1 }}
                        style={{ fontSize: '0.75rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}
                    >
                        {isExpanded ? 'COLLAPSE' : 'EXPAND'}
                    </motion.span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        style={{
                            padding: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>
            </motion.button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div style={{ padding: '0 24px 24px 24px' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '20px',
                                marginBottom: '24px'
                            }}>
                                {metrics.map((metric, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ translateY: -4, background: 'rgba(255,255,255,0.05)' }}
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            padding: '24px',
                                            borderRadius: '24px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{
                                                color: metric.color,
                                                background: `${metric.color}15`,
                                                padding: '10px',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {metric.icon}
                                            </div>
                                            <strong style={{ fontSize: '1rem', color: '#fff', fontWeight: '700' }}>{metric.title}</strong>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
                                            {parseDescription(metric.description)}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    padding: '20px',
                                    background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                    border: '1px dashed rgba(168, 85, 247, 0.3)',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{
                                    background: 'rgba(168, 85, 247, 0.2)',
                                    padding: '8px',
                                    borderRadius: '12px',
                                    color: '#c084fc'
                                }}>
                                    <Zap size={20} />
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                                    <strong style={{ color: '#fff' }}>Pro Tip:</strong> Price updates daily increase accuracy by up to <span style={{ color: '#22c55e', fontWeight: '900' }}>35%</span>. Keeping your data fresh builds driver trust instantly.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
