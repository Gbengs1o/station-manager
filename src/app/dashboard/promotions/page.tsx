'use client';

import { createClient } from '@/utils/supabase/client';
import { Award, DollarSign, Eye, Flame, MousePointer2, Plus, RefreshCw, Rocket, Shield, TrendingUp, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../dashboard.module.css';
import { getActivePromotion, getCampaignHistory, getPromotionTiers, getWalletInfo } from './actions';
import ActivePromotionCard from './ActivePromotionCard';
import BoostModal from './BoostModal';
import promoStyles from './promotions.module.css';
import WalletDashboard from './WalletDashboard';

const TIER_ICONS: Record<string, any> = {
    'Quick Boost': <Rocket size={22} />,
    'Flash Sale': <Flame size={22} />,
    'Area Takeover': <Zap size={22} />,
    'Featured Station': <Award size={22} />,
    'Scarcity Hero': <Shield size={22} />,
};

const TIER_COLORS: Record<string, string> = {
    'Quick Boost': '#3b82f6',
    'Flash Sale': '#f59e0b',
    'Area Takeover': '#10b981',
    'Featured Station': '#9b59ff',
    'Scarcity Hero': '#ef4444',
};

export default function PromotionsPage() {
    const router = useRouter();
    const [walletData, setWalletData] = useState<any>(null);
    const [tiers, setTiers] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [activePromo, setActivePromo] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stationId, setStationId] = useState<number | null>(null);
    const [refreshingSection, setRefreshingSection] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [wData, tData] = await Promise.all([
                getWalletInfo(),
                getPromotionTiers()
            ]);
            setWalletData(wData);
            setTiers(tData);

            // Fetch Manager Station ID
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('manager_profiles')
                    .select('station_id')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const sid = Number(profile.station_id);
                    setStationId(sid);

                    const [hData, activeData] = await Promise.all([
                        getCampaignHistory(sid),
                        getActivePromotion(sid)
                    ]);
                    setHistory(hData || []);
                    setActivePromo(activeData);
                }
            }
        } catch (error) {
            console.error('Error fetching promotion data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = async (section: string) => {
        setRefreshingSection(section);
        try {
            if (section === 'wallet') {
                const wData = await getWalletInfo();
                setWalletData(wData);
            } else if (section === 'analytics' || section === 'history') {
                if (stationId) {
                    const [hData, activeData] = await Promise.all([
                        getCampaignHistory(stationId),
                        getActivePromotion(stationId)
                    ]);
                    setHistory(hData || []);
                    setActivePromo(activeData);
                }
            } else if (section === 'plans') {
                const tData = await getPromotionTiers();
                setTiers(tData);
            } else {
                await fetchData();
            }
        } catch (error) {
            console.error(`Error refreshing ${section}:`, error);
        } finally {
            setRefreshingSection(null);
        }
    };

    // Compute analytics from campaign history
    const analytics = useMemo(() => {
        const totalReach = history.reduce((sum, c) => sum + (c.views || 0), 0);
        const totalClicks = history.reduce((sum, c) => sum + (c.clicks || 0), 0);
        const avgCTR = totalReach > 0 ? ((totalClicks / totalReach) * 100).toFixed(1) : '0.0';
        const totalSpent = history.reduce((sum, c) => sum + (c.tier?.price || 0), 0);
        return { totalReach, totalClicks, avgCTR, totalSpent, totalCampaigns: history.length };
    }, [history]);

    if (isLoading) return <div className={styles.dashboard}>Loading promotional tools...</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1>Promotional Tools</h1>
                    <p>Boost your station&apos;s visibility and drive more sales</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!stationId}
                >
                    <Plus size={16} /> Create New Promotion
                </button>
            </header>

            {/* Active Promotion Banner */}
            {activePromo && (
                <div style={{ marginBottom: '24px' }}>
                    <ActivePromotionCard promotion={activePromo} />
                </div>
            )}

            <WalletDashboard
                wallet={walletData?.wallet}
                transactions={walletData?.transactions || []}
                onRefresh={() => handleRefresh('wallet')}
                isRefreshing={refreshingSection === 'wallet'}
            />

            {/* Analytics Summary */}
            <div>
                <div className={promoStyles.sectionHeaderRow}>
                    <h2>Performance Analytics</h2>
                    <button
                        className={refreshingSection === 'analytics' ? promoStyles.refreshBtnSpinning : promoStyles.refreshBtn}
                        onClick={() => handleRefresh('analytics')}
                        title="Refresh analytics"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className={promoStyles.analyticsSummary} style={{ marginBottom: 0 }}>
                    <div className={promoStyles.analyticsCard}>
                        <div className={promoStyles.analyticsIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                            <Eye size={20} />
                        </div>
                        <div className={promoStyles.analyticsLabel}>Total Reach</div>
                        <div className={promoStyles.analyticsValue}>{analytics.totalReach.toLocaleString()}</div>
                    </div>
                    <div className={promoStyles.analyticsCard}>
                        <div className={promoStyles.analyticsIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <MousePointer2 size={20} />
                        </div>
                        <div className={promoStyles.analyticsLabel}>Total Clicks</div>
                        <div className={promoStyles.analyticsValue}>{analytics.totalClicks.toLocaleString()}</div>
                    </div>
                    <div className={promoStyles.analyticsCard}>
                        <div className={promoStyles.analyticsIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                            <TrendingUp size={20} />
                        </div>
                        <div className={promoStyles.analyticsLabel}>Avg. CTR</div>
                        <div className={promoStyles.analyticsValue}>{analytics.avgCTR}%</div>
                    </div>
                    <div className={promoStyles.analyticsCard}>
                        <div className={promoStyles.analyticsIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                            <DollarSign size={20} />
                        </div>
                        <div className={promoStyles.analyticsLabel}>Total Spent</div>
                        <div className={promoStyles.analyticsValue}>₦{analytics.totalSpent.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Dynamic Promotion Tiers */}
            <div className={promoStyles.promotionHistory}>
                <div className={promoStyles.sectionHeaderRow}>
                    <h2>Available Boost Plans</h2>
                    <button
                        className={refreshingSection === 'plans' ? promoStyles.refreshBtnSpinning : promoStyles.refreshBtn}
                        onClick={() => handleRefresh('plans')}
                        title="Refresh boost plans"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className={promoStyles.boostPlansGrid}>
                    {tiers.filter((t) => ['Quick Boost', 'Flash Sale', 'Area Takeover'].includes(t.name)).map((tier) => (
                        <div
                            key={tier.id}
                            className={promoStyles.boostPlanCard}
                            style={{ '--plan-color': TIER_COLORS[tier.name] || '#3b82f6' } as any}
                        >
                            <div className={promoStyles.boostPlanIcon} style={{ color: TIER_COLORS[tier.name] || '#3b82f6' }}>
                                {TIER_ICONS[tier.name] || <Rocket size={22} />}
                            </div>
                            <h3>{tier.name}</h3>
                            <p className={promoStyles.boostPlanDesc}>{tier.description}</p>
                            <div className={promoStyles.boostPlanMeta}>
                                <span className={promoStyles.boostPlanPrice}>₦{tier.price.toLocaleString()}</span>
                                <span className={promoStyles.boostPlanDuration}>{tier.duration_hours}h</span>
                            </div>
                            <div className={promoStyles.boostPlanFeatures}>
                                {tier.features?.map((f: string, i: number) => (
                                    <span key={i} className={promoStyles.featureTag}>{f.replace(/_/g, ' ')}</span>
                                ))}
                            </div>
                            <button
                                className={promoStyles.boostPlanBtn}
                                style={{ background: TIER_COLORS[tier.name] || '#3b82f6' }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Activate <Rocket size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Campaign History */}
            <div className={promoStyles.promotionHistory}>
                <div className={promoStyles.sectionHeaderRow}>
                    <h2>Campaign History</h2>
                    <button
                        className={refreshingSection === 'history' ? promoStyles.refreshBtnSpinning : promoStyles.refreshBtn}
                        onClick={() => handleRefresh('history')}
                        title="Refresh campaign history"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Campaign Tier</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Reach (Views)</th>
                                <th>Clicks</th>
                                <th>CTR</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((campaign) => {
                                    const ctr = campaign.views > 0
                                        ? ((campaign.clicks || 0) / campaign.views * 100).toFixed(1) + '%'
                                        : '—';
                                    const isExpired = new Date(campaign.end_time) < new Date();
                                    const displayStatus = campaign.status === 'active' && isExpired ? 'expired' : campaign.status;

                                    return (
                                        <tr
                                            key={campaign.id}
                                            className={promoStyles.clickableRow}
                                            onClick={() => router.push(`/dashboard/promotions/${campaign.id}`)}
                                        >
                                            <td style={{ fontWeight: '600' }}>{campaign.tier?.name}</td>
                                            <td>{new Date(campaign.start_time).toLocaleDateString()} {new Date(campaign.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{new Date(campaign.end_time).toLocaleDateString()} {new Date(campaign.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{campaign.views || 0}</td>
                                            <td>{campaign.clicks || 0}</td>
                                            <td>{ctr}</td>
                                            <td>
                                                <span className={
                                                    displayStatus === 'active'
                                                        ? styles.statusActive
                                                        : displayStatus === 'expired'
                                                            ? styles.statusPending
                                                            : styles.statusCompleted
                                                }>
                                                    {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className={promoStyles.emptyState}>
                                        No promotion history found. Start your first boost above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BoostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    fetchData(); // Refresh wallet after activation
                }}
                tiers={tiers.filter((t) => ['Quick Boost', 'Flash Sale', 'Area Takeover'].includes(t.name))}
                walletBalance={walletData?.wallet?.balance || 0}
                stationId={stationId || 0}
            />
        </div>
    );
}
