'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Rocket, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/dashboard/dashboard.module.css';

interface SmartRecommendationsProps {
    priceDiff: number;
    activePromotion: any;
    isOutOfStock: boolean;
    peakHourLabel: string;
}

export default function SmartRecommendations({
    priceDiff,
    activePromotion,
    isOutOfStock,
    peakHourLabel
}: SmartRecommendationsProps) {
    const itemVars = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className={styles.recentReports} style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            boxShadow: 'none'
        }}>
            <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                <motion.h2
                    animate={{
                        color: priceDiff > 0 ? ['#fbbf24', '#fff'] : '#fff'
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <Activity size={20} className={styles.pulseIcon} />
                    Smart Recommendations
                </motion.h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. PRICING RECOMMENDATION */}
                {priceDiff > 0 ? (
                    <motion.div
                        variants={itemVars}
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        style={{
                            background: 'rgba(251, 191, 36, 0.05)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '20px',
                            padding: '20px',
                            display: 'flex',
                            gap: '16px',
                            backdropFilter: 'blur(10px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            color: '#fbbf24',
                            minWidth: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <strong style={{ color: '#fbbf24', fontSize: '1rem' }}>Price Opportunity</strong>
                                <span style={{ fontSize: '0.7rem', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>URGENT</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                                You are <span style={{ fontWeight: '800' }}>₦{Math.round(priceDiff)}</span> above market average.
                                Lowering by <span style={{ fontWeight: '800' }}>₦5</span> could increase your visits by <span style={{ color: '#22c55e', fontWeight: '800' }}>~12%</span> today.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={itemVars}
                        whileHover={{ scale: 1.02 }}
                        style={{
                            background: 'rgba(34, 197, 94, 0.05)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '20px',
                            padding: '20px',
                            display: 'flex',
                            gap: '16px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            minWidth: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Award size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <strong style={{ color: '#22c55e', fontSize: '1rem', display: 'block', marginBottom: '4px' }}>Highly Competitive</strong>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                                You currently have the <span style={{ fontWeight: '800' }}>best price</span> in a 3km radius. This is a prime moment to build long-term driver loyalty.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* 2. PROMOTION RECOMMENDATION */}
                {!activePromotion && (
                    <Link href="/dashboard/promotions" style={{ textDecoration: 'none' }}>
                        <motion.div
                            variants={itemVars}
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                borderRadius: '20px',
                                padding: '20px',
                                display: 'flex',
                                gap: '16px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                background: 'rgba(168, 85, 247, 0.2)',
                                color: 'var(--primary)',
                                minWidth: '48px',
                                height: '48px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Rocket size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>Boost Visibility</strong>
                                    <ChevronRight size={18} color="var(--primary)" />
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>
                                    Your station visibility can increase by up to <span style={{ color: 'var(--primary)', fontWeight: '800' }}>40%</span>. Start a 2-hour Flash Sale now.
                                </p>
                            </div>
                        </motion.div>
                    </Link>
                )}

                {/* 3. STATUS */}
                <motion.div
                    variants={itemVars}
                    style={{
                        background: isOutOfStock ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isOutOfStock ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)'}`,
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                >
                    {isOutOfStock ? (
                        <AlertTriangle size={18} color="#ef4444" />
                    ) : (
                        <Activity size={18} color="#22c55e" />
                    )}
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isOutOfStock ? '#ef4444' : '#fff' }}>
                            {isOutOfStock ? 'Offline' : 'Live on Map'}
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .pulseIcon {
                    animation: pulse 2s infinite ease-in-out;
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}
