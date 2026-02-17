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

interface MobileQuickUpdateProps {
    station: any;
    reports: any[];
    competitors: any[];
    totalViews?: number;
    peakHour?: string;
}

export default function MobileQuickUpdate({
    station,
    reports,
    competitors,
    totalViews = 0,
    peakHour = '4PM'
}: MobileQuickUpdateProps) {
    // Calculate Ground Truth from reports
    const recentReports = reports || [];
    const queueStatus = recentReports.find(r => r.queue_length)?.queue_length || 'Normal';
    const stockReports = recentReports.filter(r => r.availability_status === 'In Stock').length;

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className={styles.mobileDashboard}>

            {/* 1. Hero Status Card */}
            <div className={styles.heroCard}>
                <div className={styles.heroContent}>
                    <div className={styles.greeting}>
                        <Zap size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{greeting}, Manager</span>
                    </div>
                    <h1 className={styles.stationName}>{station?.name || 'My Station'}</h1>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={`${styles.statusBadge} ${station?.is_out_of_stock ? styles.closed : ''}`}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}></div>
                            {station?.is_out_of_stock ? 'OFFLINE' : 'LIVE ON APP'}
                        </div>
                        <Link href="/dashboard/settings" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            <Settings size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Horizontal Analytics Widgets */}
            <div className={styles.widgetScroll}>
                <div className={styles.miniWidget}>
                    <div className={styles.widgetLabel}>Today's Views</div>
                    <div className={styles.widgetValue}>{totalViews}</div>
                    <div className={`${styles.widgetTrend} ${styles.trendUp}`}>
                        <TrendingUp size={12} />
                        <span>+12% vs yst</span>
                    </div>
                </div>
                <div className={styles.miniWidget}>
                    <div className={styles.widgetLabel}>Trust Score</div>
                    <div className={styles.widgetValue}>4.2</div>
                    <div className={styles.widgetTrend} style={{ color: '#fbbf24' }}>
                        <Star size={12} fill="#fbbf24" />
                        <span>Verified</span>
                    </div>
                </div>
                <div className={styles.miniWidget}>
                    <div className={styles.widgetLabel}>Est. Revenue</div>
                    <div className={styles.widgetValue}>₦2.4M</div>
                    <div className={styles.widgetLabel} style={{ fontSize: '0.6rem' }}>Today (Proj.)</div>
                </div>
                <div className={styles.miniWidget}>
                    <div className={styles.widgetLabel}>Peak Hour</div>
                    <div className={styles.widgetValue}>{peakHour}</div>
                    <div className={`${styles.widgetTrend} ${styles.trendDown}`}>
                        <AlertTriangle size={12} />
                        <span>Exp. Heavy</span>
                    </div>
                </div>
            </div>

            {/* 3. Quick Actions Grid */}
            <div className={styles.sectionHeader}>
                <h2>Quick Actions</h2>
            </div>
            <div className={styles.actionGrid}>
                <Link href="/dashboard/pricing" className={`${styles.actionBtn} ${styles.primary}`}>
                    <div className={styles.actionIcon}><Fuel /></div>
                    <div className={styles.actionLabel}>Update Prices</div>
                </Link>
                <div className={`${styles.actionBtn} ${styles.success}`}>
                    <div className={styles.actionIcon}><Store /></div>
                    <div className={styles.actionLabel}>Manage Stock</div>
                    {/* Note: This would toggle stock, for now just UI */}
                </div>
                <div className={`${styles.actionBtn} ${styles.warning}`}>
                    <div className={styles.actionIcon}><BarChart2 /></div>
                    <div className={styles.actionLabel}>Comp. Scan</div>
                </div>
                <Link href="/dashboard/reputation" className={`${styles.actionBtn} ${styles.danger}`}>
                    <div className={styles.actionIcon}><MessageSquare /></div>
                    <div className={styles.actionLabel}>Reviews (2)</div>
                </Link>
            </div>

            {/* 4. Live Feed / Ground Truth */}
            <div className={styles.sectionHeader}>
                <h2>Live Station Feed</h2>
                <Link href="/dashboard/reputation" className={styles.viewMore}>See All</Link>
            </div>
            <div className={styles.liveFeed}>
                <div className={styles.feedItem}>
                    <div className={styles.feedIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <CheckCircle2 size={16} />
                    </div>
                    <div className={styles.feedContent}>
                        <p><strong>Customer Report:</strong> Meter confirmed accurate.</p>
                        <span className={styles.feedTime}>2 mins ago via app</span>
                    </div>
                </div>
                <div className={styles.feedItem}>
                    <div className={styles.feedIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <TrendingDown size={16} />
                    </div>
                    <div className={styles.feedContent}>
                        <p><strong>Competitor Alert:</strong> Bovas lowered PMS to ₦630.</p>
                        <span className={styles.feedTime}>15 mins ago</span>
                    </div>
                </div>
                <div className={styles.feedItem}>
                    <div className={styles.feedIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <Activity size={16} />
                    </div>
                    <div className={styles.feedContent}>
                        <p><strong>Queue Alert:</strong> Traffic building up at pumps.</p>
                        <span className={styles.feedTime}>30 mins ago</span>
                    </div>
                </div>
            </div>

            {/* Flash Sale Floating Action Button */}
            <Link href="/dashboard/promotions" className={styles.flashFab}>
                <Megaphone size={24} />
            </Link>
        </div>
    );
}
