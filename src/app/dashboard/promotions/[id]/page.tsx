'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Eye, MousePointer2, TrendingUp, Zap, Flame, Rocket, Award, Shield, DollarSign, BarChart3 } from 'lucide-react';
import styles from '../../dashboard.module.css';
import promoStyles from '../promotions.module.css';
import { getCampaignDetails, getPromotionClickEvents } from '../actions';
import { createClient } from '@/utils/supabase/client';

const TIER_ICONS: Record<string, any> = {
    'Quick Boost': <Rocket size={24} />,
    'Flash Sale': <Flame size={24} />,
    'Area Takeover': <Zap size={24} />,
    'Featured Station': <Award size={24} />,
    'Scarcity Hero': <Shield size={24} />,
};

const TIER_COLORS: Record<string, string> = {
    'Quick Boost': '#3b82f6',
    'Flash Sale': '#f59e0b',
    'Area Takeover': '#10b981',
    'Featured Station': '#9b59ff',
    'Scarcity Hero': '#ef4444',
};

export default function CampaignDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<any>(null);
    const [clickEvents, setClickEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetails() {
            if (id) {
                const [campaignData, eventsData] = await Promise.all([
                    getCampaignDetails(id as string),
                    getPromotionClickEvents(id as string)
                ]);
                setCampaign(campaignData);
                setClickEvents(eventsData || []);
                setLoading(false);
            }
        }
        fetchDetails();
    }, [id]);

    if (loading) return <div className={styles.dashboard}>Loading campaign profile...</div>;
    if (!campaign) return <div className={styles.dashboard}>Campaign not found.</div>;

    const ctr = campaign.views > 0
        ? ((campaign.clicks || 0) / campaign.views * 100).toFixed(1)
        : '0.0';

    // Calculate CPC (Cost Per Click)
    const cpc = campaign.clicks > 0
        ? (campaign.tier?.price / campaign.clicks).toFixed(2)
        : '0.00';

    // Aggregate Hourly Clicks
    const hourlyAggregation = clickEvents.reduce((acc: any, event: any) => {
        const hour = new Date(event.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});

    const peakHour = Object.keys(hourlyAggregation).length > 0
        ? Object.entries(hourlyAggregation).reduce((a: any, b: any) => a[1] > b[1] ? a : b)[0]
        : null;

    const formatHour = (h: string | null) => {
        if (h === null) return 'N/A';
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour} ${ampm}`;
    };

    const isExpired = new Date(campaign.end_time) < new Date();
    const status = campaign.status === 'active' && isExpired ? 'expired' : campaign.status;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '10px',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className={styles.title}>Campaign Profile</h1>
                        <p className={styles.subtitle}>Detailed performance analysis</p>
                    </div>
                </div>
            </header>

            <div className={promoStyles.promotionsGrid} style={{ gridTemplateColumns: '1fr 350px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Main Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div className={promoStyles.planCard} style={{ padding: '24px', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                <Eye color="#3b82f6" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{campaign.views || 0}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Reach (Views)</p>
                        </div>

                        <div className={promoStyles.planCard} style={{ padding: '24px', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(168, 85, 247, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                <MousePointer2 color="#a855f7" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{campaign.clicks || 0}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Total Clicks</p>
                        </div>

                        <div className={promoStyles.planCard} style={{ padding: '24px', textAlign: 'center' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                <TrendingUp color="#10b981" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{ctr}%</h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Interest Score (CTR)</p>
                        </div>
                    </div>

                    {/* Advanced Analytics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)' }}>
                                    <DollarSign size={20} color="#f59e0b" />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Cost Efficiency</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b' }}>₦{cpc}</span>
                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>per click</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '12px', lineHeight: '1.4' }}>
                                This measures how much each interested customer cost you based on the plan price.
                            </p>
                        </div>

                        <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)' }}>
                                    <BarChart3 size={20} color="#3b82f6" />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Peak Engagement</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>{formatHour(peakHour)}</span>
                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>busiest time</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '12px', lineHeight: '1.4' }}>
                                {peakHour
                                    ? `Users are most active at this time. Plan your future flashes around this window!`
                                    : `Accumulating hourly data... Check back as customers click your profile.`}
                            </p>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(155, 89, 255, 0.1) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Marketing Performance</h3>
                        <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}>
                            This {campaign.tier?.name} campaign resulted in a <strong>{ctr}% Click-Through Rate (CTR)</strong>.
                        </p>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#a855f7', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What is CTR?</h4>
                            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
                                CTR stands for <strong>Click-Through Rate</strong>. It is your "Interest Score" — it measures how many people who saw your station actually clicked to view your details.
                            </p>

                            <h4 style={{ fontSize: '0.85rem', color: '#a855f7', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How it works</h4>
                            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.6)' }}>
                                We divide your total <strong>Clicks ({campaign.clicks || 0})</strong> by your total <strong>Reach (Views: {campaign.views || 0})</strong>.
                                A higher percentage means your station's profile is very attractive to potential customers in your area!
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${TIER_COLORS[campaign.tier?.name] || '#6366f1'} 0%, #a855f7 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                marginBottom: '16px',
                                boxShadow: `0 8px 16px -4px ${(TIER_COLORS[campaign.tier?.name] || '#6366f1')}40`
                            }}>
                                {TIER_ICONS[campaign.tier?.name] || <Zap size={32} />}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>{campaign.tier?.name}</h2>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                background: status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                color: status === 'active' ? '#10b981' : 'rgba(255, 255, 255, 0.6)',
                                border: `1px solid ${status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`
                            }}>
                                {status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} color="#3b82f6" /> Campaign ID
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{campaign.id}</p>
                            </div>

                            <div style={{ border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TrendingUp size={16} color="#10b981" /> Investment
                                </h4>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>₦{campaign.tier?.price?.toLocaleString()}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Total active testing window</p>
                            </div>
                            <div style={{ border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={16} color="#f59e0b" /> Time Frame
                                </h4>
                                <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                    From: {new Date(campaign.start_time).toLocaleDateString()}<br />
                                    Until: {new Date(campaign.end_time).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
