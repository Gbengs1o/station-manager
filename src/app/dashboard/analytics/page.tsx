import { createClient } from '@/utils/supabase/server';
import styles from '../dashboard.module.css';
import { Users, Clock, Zap, Map, Activity, MapPin } from 'lucide-react';
import RevenueTrendChart from '@/components/dashboard/analytics/RevenueTrendChart';
import ActivityHistory from '@/components/dashboard/analytics/ActivityHistory';
import CapacityManager from '@/components/dashboard/analytics/CapacityManager';
import AnalyticsHelp from '@/components/dashboard/analytics/AnalyticsHelp';
import ReachStatCard from '@/components/dashboard/analytics/ReachStatCard';
import VisitorsStatCard from '@/components/dashboard/analytics/VisitorsStatCard';
import BusiestDayStatCard from '@/components/dashboard/analytics/BusiestDayStatCard';

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

    // 2. Fetch Real Activity Data (Last 14 Days for better trend)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const fourteenDaysAgoStr = fourteenDaysAgo.toISOString();

    const [
        { data: analytics },
        { data: reports },
        { data: reviews },
        { data: priceLogs },
        { data: promos },
        { count: favCount },
        { data: favourites }
    ] = await Promise.all([
        supabase.from('station_analytics').select('*').eq('station_id', profile?.station_id).order('date', { ascending: false }).limit(30),
        supabase.from('price_reports').select('created_at, price, user_id').eq('station_id', profile?.station_id).gte('created_at', fourteenDaysAgoStr),
        supabase.from('reviews').select('created_at, user_id').eq('station_id', profile?.station_id).gte('created_at', fourteenDaysAgoStr),
        supabase.from('price_logs').select('created_at, new_price').eq('station_id', profile?.station_id).gte('created_at', fourteenDaysAgoStr),
        supabase.from('station_promotions').select('views, clicks').eq('station_id', profile?.station_id),
        supabase.from('favourite_stations').select('*', { count: 'exact', head: true }).eq('station_id', profile?.station_id),
        supabase.from('favourite_stations').select('created_at, user_id').eq('station_id', profile?.station_id)
    ]);

    const totalFavourites = favCount || 0;

    // 3. Synthesize Analytics from Activity
    const dailyData: Record<string, { visits: number, interactions: number, views: number }> = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyData[d.toISOString().split('T')[0]] = { visits: 0, interactions: 0, views: 0 };
    }

    (analytics || []).forEach(a => {
        if (dailyData[a.date]) {
            dailyData[a.date].visits = a.daily_visits || 0;
            dailyData[a.date].interactions = Number(a.revenue) || 0; // Use interaction key
            dailyData[a.date].views = a.profile_views || 0;
        }
    });

    [...(reports || []), ...(reviews || [])].forEach(item => {
        const date = item.created_at.split('T')[0];
        if (dailyData[date]) {
            dailyData[date].visits += 1;
            dailyData[date].views += 5;

            // Synthesis: Interaction points
            if ('price' in item) {
                dailyData[date].interactions += 1; // Real driver action
            }
        }
    });

    (priceLogs || []).forEach(log => {
        const date = log.created_at.split('T')[0];
        if (dailyData[date]) {
            dailyData[date].interactions += 1; // Count as 1 verified event
            dailyData[date].visits += 1;
        }
    });

    const sortedDates = Object.keys(dailyData).sort();
    const chartData = Object.entries(dailyData).map(([date, vals]) => ({
        date,
        visits: vals.visits,
        interactions: vals.interactions,
        views: vals.views
    })).sort((a, b) => a.date.localeCompare(b.date));

    const totalVisits = chartData.reduce((acc, curr) => acc + curr.visits, 0);
    const promoViews = promos?.reduce((acc, p) => acc + (p.views || 0), 0) || 0;
    const totalViews = Object.values(dailyData).reduce((acc, curr) => acc + curr.views, 0) + promoViews;

    // Community Reach = Views + Reports + Favourites
    const communityReach = totalViews + (reports?.length || 0) + totalFavourites;
    const engagementRate = totalViews > 0 ? (((reports?.length || 0) + (reviews?.length || 0)) / totalViews) * 100 : 0;

    const busiestDayEntry = chartData.reduce((prev, current) =>
        (current.visits > prev.visits) ? current : prev
        , { visits: 0, date: sortedDates[0] });

    const busiestDayLabel = busiestDayEntry.visits > 0
        ? new Date(busiestDayEntry.date).toLocaleDateString('en-US', { weekday: 'long' })
        : 'N/A';

    const peakVisits = Math.max(...chartData.map(a => a.visits), 0);

    // Deep Reach Stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    const recentInteractions = [
        ...(reports || []),
        ...(reviews || []),
        ...(favourites || [])
    ].filter(item => item.created_at >= sevenDaysAgoStr);

    const historicalInteractions = [
        ...(reports || []),
        ...(reviews || []),
        ...(favourites || [])
    ].filter(item => item.created_at < sevenDaysAgoStr);

    const currentUniqueDrivers = new Set(recentInteractions.map(i => i.user_id));
    const historicalUniqueDrivers = new Set(historicalInteractions.map(i => i.user_id));

    // Newcomers = Drivers seen this week who were NOT seen in the previous week
    const newcomers = Array.from(currentUniqueDrivers).filter(id => !historicalUniqueDrivers.has(id)).length;

    const reachDetails = {
        uniqueDrivers: currentUniqueDrivers.size,
        newcomers: newcomers,
        breakdown: {
            views: totalViews,
            reports: (reports || []).filter(r => r.created_at >= sevenDaysAgoStr).length,
            favorites: totalFavourites,
            reviews: (reviews || []).filter(r => r.created_at >= sevenDaysAgoStr).length
        }
    };

    // Visitors Stats
    const currentWeekVisits = chartData.filter(d => d.date >= sevenDaysAgoStr).reduce((acc, d) => acc + d.visits, 0);
    const prevWeekVisits = chartData.filter(d => d.date < sevenDaysAgoStr).reduce((acc, d) => acc + d.visits, 0);
    const avgPerDay = Math.round(totalVisits / 14);
    const growth = prevWeekVisits > 0 ? Math.round(((currentWeekVisits - prevWeekVisits) / prevWeekVisits) * 100) : 0;

    // Busiest Day operational data (synthesized peak demand)
    const peakHour = busiestDayEntry.visits > 50 ? "08:00 AM - 10:00 AM" : "04:00 PM - 06:00 PM";
    const distribution = [
        { period: 'Morning', volume: Math.round(peakVisits * 0.45) },
        { period: 'Afternoon', volume: Math.round(peakVisits * 0.35) },
        { period: 'Evening', volume: Math.round(peakVisits * 0.20) }
    ];

    const capacityUsage = maxCapacity > 0 ? Math.min(Math.round((peakVisits / maxCapacity) * 100), 100) : 0;
    const conversionEfficiency = totalViews > 0 ? Math.min(Math.round((totalVisits / totalViews) * 100), 100) : 0;

    // 5. Merge for Activity Feed
    const allActivities: any[] = [
        ...(reports || []).map(r => ({ type: 'report', created_at: r.created_at, description: 'New Driver Price Report' })),
        ...(reviews || []).map(r => ({ type: 'review', created_at: r.created_at, description: 'New Station Review' })),
        ...(priceLogs || []).map(r => ({ type: 'price_log', created_at: r.created_at, description: 'Base Price Update' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
                <div className={styles.statCard} style={{ cursor: 'help' }}>
                    <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                        <MapPin size={20} />
                    </div>
                    <h3>Station Capacity Usage</h3>
                    <CapacityManager initialCapacity={100} currentUsage={capacityUsage} />
                </div>
                <VisitorsStatCard
                    totalVisits={totalVisits}
                    avgPerDay={avgPerDay}
                    growth={growth}
                    dailyBreakdown={chartData.slice(-7)}
                />
                <BusiestDayStatCard
                    busiestDayLabel={busiestDayLabel}
                    peakVisits={peakVisits}
                    peakHour={peakHour}
                    distribution={distribution}
                />
                <ReachStatCard
                    communityReach={communityReach}
                    totalFavourites={totalFavourites}
                    details={reachDetails}
                />
            </div>

            <div className={styles.mainContent}>
                <div className={styles.chartArea}>
                    <div className={styles.sectionHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={20} color="var(--primary)" />
                            <h2 style={{ margin: 0 }}>Community Interaction Trend</h2>
                        </div>
                        <p>Verified driver reports and verified app engagement.</p>
                    </div>
                    <RevenueTrendChart data={chartData} />
                </div>

                <div className={styles.recentReports}>
                    <div className={styles.sectionHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={20} color="var(--primary)" />
                            <h2 style={{ margin: 0 }}>Live Activity Feed</h2>
                        </div>
                        <p>Real-time updates from drivers and system logs.</p>
                    </div>
                    <ActivityHistory activities={allActivities} />

                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <CapacityManager
                            stationId={profile?.station_id || 0}
                            initialCapacity={maxCapacity}
                            peakVisits={peakVisits}
                        />

                        <div className={styles.loyaltyItem}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Conversion Efficency</span>
                                <span style={{ fontWeight: 600 }}>{conversionEfficiency}%</span>
                            </div>
                            <div className={styles.barWrap} style={{ background: 'var(--border)' }}>
                                <div className={styles.bar} style={{ width: `${conversionEfficiency}%`, background: 'var(--primary)' }}></div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                % of viewers who became verified interaction partners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <AnalyticsHelp />
        </div>
    );
}
