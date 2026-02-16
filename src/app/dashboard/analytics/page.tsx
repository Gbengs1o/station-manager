import { createClient } from '@/utils/supabase/server';
import styles from '../dashboard.module.css';
import { Users, Clock, Zap, Map } from 'lucide-react';
import RevenueTrendChart from '@/components/dashboard/analytics/RevenueTrendChart';

export default async function AnalyticsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Fetch Station ID & Capacity
    const { data: profile } = await supabase
        .from('manager_profiles')
        .select('station_id, stations(max_daily_capacity)')
        .eq('id', user?.id)
        .single();

    const stationData = profile as any;
    const maxCapacity = stationData?.stations?.max_daily_capacity || 500;

    // 2. Fetch Analytics Data (Last 7 Days)
    const { data: analytics } = await supabase
        .from('station_analytics')
        .select('date, daily_visits, revenue, profile_views')
        .eq('station_id', profile?.station_id)
        .order('date', { ascending: false })
        .limit(7);

    // Default to empty array if no data
    const safeAnalytics = analytics || [];

    // Sort for historical calculations (oldest to newest)
    const sortedAnalytics = [...safeAnalytics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 3. Compute Metrics
    const totalVisits = safeAnalytics.reduce((acc, curr) => acc + (curr.daily_visits || 0), 0);
    const totalRevenue = safeAnalytics.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0);
    const totalViews = safeAnalytics.reduce((acc, curr) => acc + (curr.profile_views || 0), 0);

    // Find Busiest Day
    const busiestDayEntry = safeAnalytics.reduce((prev, current) =>
        (current.daily_visits > prev.daily_visits) ? current : prev
        , { daily_visits: 0, date: '' });

    const busiestDayLabel = busiestDayEntry.date
        ? new Date(busiestDayEntry.date).toLocaleDateString('en-US', { weekday: 'long' })
        : 'N/A';

    // Station Capacity Logic: Peak Visits vs Max Capacity
    const peakVisits = Math.max(...safeAnalytics.map(a => a.daily_visits || 0), 0);
    const capacityUsage = maxCapacity > 0 ? Math.min(Math.round((peakVisits / maxCapacity) * 100), 100) : 0;

    // Conversion Logic: Total Visits vs profile views
    const conversionEfficiency = totalViews > 0 ? Math.min(Math.round((totalVisits / totalViews) * 100), 100) : 0;

    const sampleLength = safeAnalytics.length;
    const avgVisits = totalVisits / (sampleLength || 1);

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1>Traffic & Demand Analytics</h1>
                    <p>Optimize your operations with data-driven insights</p>
                </div>
                {/* Removed Time Filter for now as we only fetch last 7 days */}
                <div className={styles.statusBadge}>Last 7 Days</div>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <Users size={20} />
                    </div>
                    <h3>Total Visitors</h3>
                    <p className={styles.statValue}>{totalVisits.toLocaleString()}</p>
                    <span className={styles.statTrend}>
                        Avg {Math.round(totalVisits / 7).toLocaleString()}/day
                    </span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                        <Clock size={20} />
                    </div>
                    <h3>Busiest Day</h3>
                    <p className={styles.statValue} style={{ fontSize: '1.5rem' }}>{busiestDayLabel}</p>
                    <span className={styles.statTrend}>{busiestDayEntry.daily_visits.toLocaleString()} visits</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                        <Zap size={20} />
                    </div>
                    <h3>Est. Revenue</h3>
                    <p className={styles.statValue}>₦{(totalRevenue / 1000000).toFixed(1)}M</p>
                    <span className={styles.statTrend}>Total: ₦{totalRevenue.toLocaleString()}</span>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.chartArea}>
                    <div className={styles.sectionHeader}>
                        <h2>Weekly Revenue Trend</h2>
                        <p>Daily revenue performance over the last 7 days.</p>
                    </div>
                    <RevenueTrendChart data={sortedAnalytics.map(a => ({ date: a.date, revenue: a.revenue || 0 }))} />
                </div>

                <div className={styles.recentReports}>
                    <h2>Traffic Breakdown</h2>
                    <div className={styles.loyaltystats} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className={styles.loyaltyItem}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Station Capacity Usage</span>
                                <span style={{ fontWeight: 600 }}>{capacityUsage}%</span>
                            </div>
                            <div className={styles.barWrap} style={{ background: 'var(--border)' }}>
                                <div className={styles.bar} style={{ width: `${capacityUsage}%`, background: '#22c55e' }}></div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Based on daily visit peaks vs. estimated max capacity.
                            </p>
                        </div>

                        <div className={styles.loyaltyItem}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Conversion Efficency</span>
                                <span style={{ fontWeight: 600 }}>{conversionEfficiency}%</span>
                            </div>
                            <div className={styles.barWrap} style={{ background: 'var(--border)' }}>
                                <div className={styles.bar} style={{ width: `${conversionEfficiency}%`, background: 'var(--primary)' }}></div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                % of drivers viewing profile who reflect in daily visits.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
