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
    Megaphone
} from 'lucide-react';
import styles from './mobile-dashboard.module.css';
import Link from 'next/link';

interface MobileQuickUpdateProps {
    station: any;
    reports: any[];
    competitors: any[];
}

export default function MobileQuickUpdate({ station, reports, competitors }: MobileQuickUpdateProps) {
    // Calculate Ground Truth from reports
    const recentReports = reports || [];
    const queueStatus = recentReports.find(r => r.queue_length)?.queue_length || 'Normal';
    const stockReports = recentReports.filter(r => r.availability_status === 'In Stock').length;
    const accuracyReports = recentReports.filter(r => r.meter_accuracy === 100).length;

    const nearestComp = competitors?.[0];
    const priceDiff = (nearestComp && station) ? (station.price_pms - nearestComp.price_pms) : 0;

    return (
        <div className={styles.mobileDashboard}>
            {/* Header */}
            <header className={styles.header}>
                <h1>
                    FyndFuel Manager
                    <span>Station: {station?.name || '---'}, {station?.state || '---'}</span>
                </h1>
                <Bell size={24} color="var(--mobile-text-dim)" />
            </header>

            {/* Trust Banner */}
            <div className={styles.trustBanner}>
                <Star size={18} fill="var(--mobile-primary)" color="var(--mobile-primary)" />
                4.2 / 5 Station Trust Score (Verified)
            </div>

            {/* Official Prices */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Today&apos;s Official Prices</h2>
                    <Link href="/dashboard/pricing" className={styles.viewMore}>Market Stats →</Link>
                </div>
                <div className={styles.priceCard}>
                    <div className={styles.priceRow}>
                        <div className={styles.fuelInfo}>
                            <div className={styles.fuelIcon}><Fuel size={20} color="#3b82f6" /></div>
                            <div className={styles.fuelDetails}>
                                <h3>PMS (Petrol)</h3>
                                <p>₦{station?.price_pms || '0.00'}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/pricing" className={styles.editBtn}>✏️ Edit</Link>
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.fuelInfo}>
                            <div className={styles.fuelIcon}><Fuel size={20} color="#10b981" /></div>
                            <div className={styles.fuelDetails}>
                                <h3>AGO (Diesel)</h3>
                                <p>₦{station?.price_ago || '0.00'}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/pricing" className={styles.editBtn}>✏️ Edit</Link>
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.fuelInfo}>
                            <div className={styles.fuelIcon}><Fuel size={20} color="#f59e0b" /></div>
                            <div className={styles.fuelDetails}>
                                <h3>DPK (Kerosene)</h3>
                                <p>₦{station?.price_dpk || '0.00'}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/pricing" className={styles.editBtn}>✏️ Edit</Link>
                    </div>
                </div>
            </section>

            {/* Ground Truth */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>User Live Reports (Ground Truth)</h2>
                    <Link href="/dashboard/reputation" className={styles.viewMore}>Full Audit →</Link>
                </div>
                <div className={styles.groundTruthGrid}>
                    <div className={styles.truthCard}>
                        <div className={styles.truthLabel}>
                            <strong>QUEUE:</strong>
                            <span>🟡 {queueStatus}</span>
                        </div>
                        <span className={styles.truthCount}>({recentReports.length} Reports)</span>
                    </div>
                    <div className={styles.truthCard}>
                        <div className={styles.truthLabel}>
                            <strong>STOCKS:</strong>
                            <span className={styles.badgeSuccess}>🟢 In Stock</span>
                        </div>
                        <span className={styles.truthCount}>({stockReports} Reports)</span>
                    </div>
                    <div className={styles.truthCard}>
                        <div className={styles.truthLabel}>
                            <strong>ACCURACY:</strong>
                            <span className={styles.badgeSuccess}>✅ 100% Correct</span>
                        </div>
                        <span className={styles.truthCount}>(Last 1hr)</span>
                    </div>
                </div>
            </section>

            {/* Market Insights */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Market Insights</h2>
                    <Link href="/dashboard/analytics" className={styles.viewMore}>Full Report →</Link>
                </div>
                <div className={styles.insightList}>
                    <div className={styles.insightItem}>
                        <TrendingDown size={18} color={priceDiff > 0 ? 'var(--mobile-danger)' : 'var(--mobile-success)'} />
                        <span>Nearest Competitor: ₦{nearestComp?.price_pms || '---'} ({priceDiff > 0 ? `+₦${priceDiff}` : `-₦${Math.abs(priceDiff)}`})</span>
                    </div>
                    <div className={styles.insightItem}>
                        <Users size={18} color="var(--mobile-primary)" />
                        <span>450 users viewed your station in last 2hrs</span>
                    </div>
                    <div className={styles.insightItem}>
                        <AlertTriangle size={18} color="var(--mobile-warning)" />
                        <span>Peak Hour Alert: Busy traffic expected at 4PM</span>
                    </div>
                </div>
            </section>

            {/* Flash Promo Action */}
            <Link href="/dashboard/promotions" className={styles.flashPromoBtn}>
                <Megaphone size={20} />
                RUN A 2-HOUR FLASH PROMO (₦)
            </Link>
        </div>
    );
}
