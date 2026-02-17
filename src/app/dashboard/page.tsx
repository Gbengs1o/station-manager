import { createClient } from '@/utils/supabase/server';
import styles from './dashboard.module.css';
import {
    TrendingUp,
    Users,
    Droplet,
    Activity,
    AlertTriangle, // Added for dynamic alerts
    Award // Added for dynamic alerts
} from 'lucide-react';
import CompetitorWatch from '@/components/dashboard/overview/CompetitorWatch';
import FeedbackSnapshot from '@/components/dashboard/overview/FeedbackSnapshot';
import StockOutToggle from '@/components/dashboard/pricing/StockOutToggle';
import MarketTrendChart from '@/components/dashboard/overview/MarketTrendChart'; // Added import
import MobileQuickUpdate from '@/components/dashboard/overview/MobileQuickUpdate';

export default async function DashboardOverview() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Fetch Manager & Station Info
    const { data: profile } = await supabase
        .from('manager_profiles')
        .select('station_id')
        .eq('id', user?.id)
        .single();

    const { data: station } = await supabase
        .from('stations')
        .select('*')
        .eq('id', profile?.station_id)
        .single();

    // 2. Fetch Nearest 3 Competitors
    const userLat = station?.latitude || 7.404818;
    const userLon = station?.longitude || 3.810341;

    const { data: nearby } = await supabase
        .from('stations')
        .select('id, name, brand, price_pms, latitude, longitude')
        .eq('state', station?.state || 'Oyo')
        .neq('id', station?.id)
        .limit(10);

    const formattedCompetitors = (nearby || [])
        .map(c => {
            const lat1 = userLat;
            const lon1 = userLon;
            const lat2 = c.latitude || 0;
            const lon2 = c.longitude || 0;
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const dist = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
            return { ...c, distanceValue: dist, distance: `${dist.toFixed(1)}km` };
        })
        .sort((a, b) => a.distanceValue - b.distanceValue)
        .slice(0, 3)
        .map(c => ({
            ...c,
            price_pms: parseFloat(c.price_pms as any) || 645
        }));

    // 3. Fetch Recent Feedback
    const { data: feedbacks } = await supabase
        .from('reviews')
        .select('*')
        .eq('station_id', station?.id)
        .order('created_at', { ascending: false })
        .limit(5);

    // 4. Fetch User Reports (Ground Truth)
    const { data: reports } = await supabase
        .from('price_reports')
        .select('*')
        .eq('station_id', station?.id)
        .order('created_at', { ascending: false })
        .limit(10);

    // 5. Fetch Analytics (Daily Visits)
    const { data: analytics } = await supabase
        .from('station_analytics')
        .select('daily_visits, date')
        .eq('station_id', station?.id)
        .order('date', { ascending: false })
        .limit(2); // Get today and yesterday

    const todayVisits = analytics?.[0]?.daily_visits || 0;
    const yesterdayVisits = analytics?.[1]?.daily_visits || 0;
    const visitGrowth = yesterdayVisits > 0
        ? ((todayVisits - yesterdayVisits) / yesterdayVisits) * 100
        : 0;

    // 6. Fetch Price History for Chart
    const { data: priceHistory } = await supabase
        .from('price_logs')
        .select('new_price, created_at')
        .eq('station_id', station?.id)
        .eq('fuel_type', 'PMS')
        .order('created_at', { ascending: true })
        .limit(7);

    // Calculate Real Market Average from nearby competitors
    const validCompetitors = nearby?.filter(c => c.price_pms > 0) || [];
    const realMarketAvg = validCompetitors.length > 0
        ? validCompetitors.reduce((acc, c) => acc + (c.price_pms || 0), 0) / validCompetitors.length
        : 645; // Fallback if no data

    const priceDiff = (station?.price_pms || 0) - realMarketAvg;

    // Prepare Chart Data
    // For now, we simulate a 7-day trend using the current market avg as a baseline
    // In a real app, we'd query competitor price history too.
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = new Date().getDay() - 1; // 0=Mon (approx depending on loop)

    // Create a smooth trend data array
    const trendData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = days[date.getDay()];

        // Use actual price history if available, else carry forward current price
        // This is a simplified mapping logic
        const historicPrice = priceHistory?.find(p => new Date(p.created_at).getDate() === date.getDate())?.new_price
            || station?.price_pms
            || 640;

        return {
            day: dayName,
            yourPrice: Number(historicPrice),
            marketAvg: Math.round(realMarketAvg) // Flat line for market avg for now
        };
    });

    // 7. Fetch Real Analytics for "Search Impressions"
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: todayAnalytics } = await supabase
        .from('station_analytics')
        .select('profile_views')
        .eq('station_id', station?.id)
        .eq('date', todayStr)
        .single();

    // Fallback to yesterday if today is empty (for demo continuity)
    const displayViews = todayAnalytics?.profile_views || analytics?.[0]?.profile_views || 0;

    // 8. Calculate "Peak Hours" from Report Timestamps (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: reportTimestamps } = await supabase
        .from('price_reports')
        .select('created_at')
        .eq('station_id', station?.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .limit(1000);

    // Analyze timestamps to find peak hour
    const hourCounts: Record<number, number> = {};
    (reportTimestamps || []).forEach(r => {
        const hour = new Date(r.created_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour24 = Object.keys(hourCounts).length > 0
        ? Object.entries(hourCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : null;

    const peakHourLabel = peakHour24
        ? `${Number(peakHour24) % 12 || 12}${Number(peakHour24) >= 12 ? 'PM' : 'AM'}`
        : '4PM'; // Default if no data

    return (
        <>
            <div className={styles.mobileOnly}>
                <MobileQuickUpdate
                    station={station}
                    reports={reports || []}
                    competitors={formattedCompetitors}
                    totalViews={displayViews}
                    peakHour={peakHourLabel}
                />
            </div>

            <div className={`${styles.dashboard} ${styles.desktopOnly}`}>
                <header className={styles.header}>
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>Welcome back! Here&apos;s a summary of your station&apos;s performance.</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button className="btn-secondary">Export Data</button>
                        <button className="btn-primary">Daily Report</button>
                    </div>
                </header>

                <div className={styles.mainContent}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Main Stats */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--primary)' }}>
                                    <TrendingUp size={24} />
                                </div>
                                <div className={styles.statLabel}>Market Position</div>
                                <div className={styles.statValue}>{priceDiff <= 0 ? 'Competitive' : 'Above Avg'}</div>
                                <div className={styles.statChange} style={{ color: priceDiff <= 0 ? '#22c55e' : '#ef4444' }}>
                                    {priceDiff <= 0 ? `₦${Math.abs(Math.round(priceDiff))} below` : `₦${Math.round(priceDiff)} above`} market avg
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                                    <Users size={24} />
                                </div>
                                <div className={styles.statLabel}>Daily Customers</div>
                                <div className={styles.statValue}>{todayVisits.toLocaleString()}</div>
                                <div className={styles.statChange} style={{ color: visitGrowth >= 0 ? '#22c55e' : '#ef4444' }}>
                                    {visitGrowth >= 0 ? '+' : ''}{visitGrowth.toFixed(1)}% since yesterday
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                    <Droplet size={24} />
                                </div>
                                <div className={styles.statLabel}>PMS Price</div>
                                <div className={styles.statValue}>₦{station?.price_pms || 645}</div>
                                <div className={styles.statChange} style={{ color: 'var(--text-secondary)' }}>Updated today</div>
                            </div>
                        </div>

                        {/* Module Snapshots */}
                        <FeedbackSnapshot feedbacks={feedbacks || []} />

                        <div className={styles.chartArea}>
                            <div className={styles.sectionHeader}>
                                <h2>Market Opportunity Trend</h2>
                                <p>Your pricing vs the market average (7-day history)</p>
                            </div>
                            <MarketTrendChart data={trendData} />
                        </div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <StockOutToggle stationId={station?.id} isOutOfStock={station?.is_out_of_stock || false} />

                        <CompetitorWatch competitors={formattedCompetitors} yourPrice={station?.price_pms || 1} />

                        <div className={styles.recentReports}>
                            <div className={styles.sectionHeader}>
                                <h2>Active Alerts</h2>
                            </div>
                            {station?.is_out_of_stock ? (
                                <div className={styles.alertItem} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                                    <AlertTriangle size={20} color="#ef4444" />
                                    <div>
                                        <strong style={{ color: '#ef4444' }}>Station Offline</strong>
                                        <p>Drivers cannot see you in the app.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.alertItem}>
                                    <Activity size={20} color="#22c55e" />
                                    <div>
                                        <strong>All Systems Normal</strong>
                                        <p>Station is visible to all drivers.</p>
                                    </div>
                                </div>
                            )}
                            <div className={styles.alertItem}>
                                <Award size={20} color="var(--primary)" />
                                <div>
                                    <strong>Verification Points</strong>
                                    <p>You need 350 more pts for Gold Badge.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
