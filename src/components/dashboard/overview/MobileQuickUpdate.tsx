'use client';

import {
    Bell,
    Star,
    Fuel,
    Edit3,
    Users,
    CheckCircle2,
    AlertTriangle,
    TrendingDown,
    Home,
    BarChart2,
    MessageSquare,
    Settings,
    Megaphone,
    Zap,
    TrendingUp,
    Store,
    Activity
} from 'lucide-react';
import styles from './mobile-dashboard.module.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileQuickUpdateProps {
    station: any;
    reports: any[];
    competitors: any[];
    totalViews?: number;
    peakHour?: string;
    activePromotion?: any;
}

const containerVars = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function MobileQuickUpdate({
    station,
    reports,
    competitors,
    totalViews = 0,
    peakHour = '4PM',
    activePromotion
}: MobileQuickUpdateProps) {
    // Calculate Ground Truth from reports
    const recentReports = reports || [];
    const queueStatus = recentReports.find(r => r.queue_length)?.queue_length || 'Normal';
    const stockReports = recentReports.filter(r => r.availability_status === 'In Stock').length;

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <motion.div
            className={styles.mobileDashboard}
            initial="hidden"
            animate="show"
            variants={containerVars}
        >

            {/* 1. Hero Status Card */}
            <motion.div variants={itemVars} className={styles.heroCard}>
                <div className={styles.heroContent}>
                    <div className={styles.greeting}>
                        <Zap size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{greeting}, Manager</span>
                    </div>
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={styles.stationName}
                    >
                        {station?.name || 'My Station'}
                    </motion.h1>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={`${styles.statusBadge} ${station?.is_out_of_stock ? styles.closed : ''}`}>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}
                            />
                            {station?.is_out_of_stock ? 'OFFLINE' : 'LIVE ON APP'}
                        </div>
                        <Link href="/dashboard/settings" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            <Settings size={20} />
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Active Promotion Banner for Mobile */}
            {activePromotion && (
                <motion.div
                    variants={itemVars}
                    className={styles.activePromoBanner}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link href="/dashboard/promotions" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                        <div className={styles.activePromoContent}>
                            <div className={styles.activePromoHeader}>
                                <div className={styles.pulseIcon}><Zap size={14} fill="#fbbf24" /></div>
                                <span>{activePromotion.tier?.name} is LIVE</span>
                            </div>
                            <div className={styles.activePromoStats}>
                                <span>{activePromotion.views || 0} Reach</span>
                                <span className={styles.divider}>•</span>
                                <span>{activePromotion.clicks || 0} Clicks</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            )}

            {/* 2. Horizontal Analytics Widgets */}
            <motion.div variants={itemVars} className={styles.widgetScroll}>
                <Link href="/dashboard/analytics" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <motion.div whileTap={{ scale: 0.95 }} className={styles.miniWidget}>
                        <div className={styles.widgetLabel}>Today&apos;s Views</div>
                        <div className={styles.widgetValue}>{totalViews}</div>
                        <div className={`${styles.widgetTrend} ${styles.trendUp}`}>
                            <TrendingUp size={12} />
                            <span>+12% vs yst</span>
                        </div>
                    </motion.div>
                </Link>
                <div className={styles.miniWidget}>
                    <div className={styles.widgetLabel}>Trust Score</div>
                    <div className={styles.widgetValue}>4.2</div>
                    <div className={styles.widgetTrend} style={{ color: '#fbbf24' }}>
                        <Star size={12} fill="#fbbf24" />
                        <span>Verified</span>
                    </div>
                </div>
                <Link href="/dashboard/analytics" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <motion.div whileTap={{ scale: 0.95 }} className={styles.miniWidget}>
                        <div className={styles.widgetLabel}>Est. Revenue</div>
                        <div className={styles.widgetValue}>₦2.4M</div>
                        <div className={styles.widgetLabel} style={{ fontSize: '0.6rem' }}>Today (Proj.)</div>
                    </motion.div>
                </Link>
                <div className={styles.miniWidget}>
                    <div className={styles.widgetLabel}>Peak Hour</div>
                    <div className={styles.widgetValue}>{peakHour}</div>
                    <div className={`${styles.widgetTrend} ${styles.trendDown}`}>
                        <AlertTriangle size={12} />
                        <span>Exp. Heavy</span>
                    </div>
                </div>
            </motion.div>

            {/* 3. Quick Actions Grid */}
            <motion.div variants={itemVars} className={styles.sectionHeader}>
                <h2>Quick Actions</h2>
            </motion.div>
            <motion.div variants={itemVars} className={styles.actionGrid}>
                <motion.div whileTap={{ scale: 0.95 }}>
                    <Link href="/dashboard/pricing" className={`${styles.actionBtn} ${styles.primary}`}>
                        <div className={styles.actionIcon}><Fuel /></div>
                        <div className={styles.actionLabel}>Update Prices</div>
                    </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} className={`${styles.actionBtn} ${styles.success}`}>
                    <div className={styles.actionIcon}><Store /></div>
                    <div className={styles.actionLabel}>Manage Stock</div>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} className={`${styles.actionBtn} ${styles.warning}`}>
                    <div className={styles.actionIcon}><BarChart2 /></div>
                    <div className={styles.actionLabel}>Comp. Scan</div>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                    <Link href="/dashboard/reputation" className={`${styles.actionBtn} ${styles.danger}`}>
                        <div className={styles.actionIcon}><MessageSquare /></div>
                        <div className={styles.actionLabel}>Reviews (2)</div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* 4. Live Feed / Ground Truth */}
            <motion.div variants={itemVars} className={styles.sectionHeader}>
                <h2>Live Station Feed</h2>
                <Link href="/dashboard/reputation" className={styles.viewMore}>See All</Link>
            </motion.div>
            <motion.div variants={itemVars} className={styles.liveFeed}>
                <AnimatePresence>
                    {[
                        { icon: <CheckCircle2 size={16} />, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', text: 'Customer Report: Meter confirmed accurate.', time: '2 mins ago' },
                        { icon: <TrendingDown size={16} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'Competitor Alert: Bovas lowered PMS to ₦630.', time: '15 mins ago' },
                        { icon: <Activity size={16} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', text: 'Queue Alert: Traffic building up at pumps.', time: '30 mins ago' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className={styles.feedItem}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                        >
                            <div className={styles.feedIcon} style={{ background: item.bg, color: item.color }}>
                                {item.icon}
                            </div>
                            <div className={styles.feedContent}>
                                <p><strong>Report:</strong> {item.text}</p>
                                <span className={styles.feedTime}>{item.time} via app</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Flash Sale Floating Action Button */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
            >
                <Link href="/dashboard/promotions" className={styles.flashFab}>
                    <Megaphone size={24} />
                </Link>
            </motion.div>
        </motion.div>
    );
}
