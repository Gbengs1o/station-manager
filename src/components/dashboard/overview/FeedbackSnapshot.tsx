'use client';

import { useState } from 'react';
import { MessageCircle, Star, User } from 'lucide-react';
import { getScoutProfile } from '@/app/dashboard/reputation/actions';
import ScoutProfileModal from '../reputation/ScoutProfileModal';
import styles from '@/app/dashboard/dashboard.module.css';

interface Feedback {
    id: string;
    comment: string;
    rating: number;
    sentiment: string;
    created_at: string;
    type?: 'review' | 'report';
    user_id?: string;
    price?: number;
    fuel_type?: string;
    meter_accuracy?: number;
    profiles?: {
        full_name: string;
        avatar_url: string;
    };
}

interface FeedbackSnapshotProps {
    feedbacks: Feedback[];
}

export default function FeedbackSnapshot({ feedbacks }: FeedbackSnapshotProps) {
    const [isScoutModalOpen, setIsScoutModalOpen] = useState(false);
    const [scoutData, setScoutData] = useState<any>(null);
    const [isScoutLoading, setIsScoutLoading] = useState(false);

    async function handleOpenScoutProfile(userId: string) {
        if (!userId) return;
        setIsScoutModalOpen(true);
        setIsScoutLoading(true);
        try {
            const data = await getScoutProfile(userId);
            setScoutData(data);
        } catch (error) {
            console.error('Failed to fetch scout profile:', error);
        } finally {
            setIsScoutLoading(false);
        }
    }

    return (
        <div className={styles.chartArea} style={{ border: '1px solid var(--border)' }}>
            <div className={styles.sectionHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle size={20} color="var(--primary)" />
                    <h2>Eyes & Ears: User Feedback</h2>
                </div>
                <p>Direct reports on staff performance and station quality.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feedbacks.slice(0, 3).map((f: any) => (
                    <div key={f.id} className={styles.competitorCard} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: f.type === 'report' ? '1px solid rgba(59, 130, 246, 0.2)' : 'none' }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', cursor: f.user_id ? 'pointer' : 'default' }}
                            onClick={() => f.user_id && handleOpenScoutProfile(f.user_id)}
                            title={f.user_id ? "View Scout Profile" : ""}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <div className={styles.avatar} style={{ width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                    {(f.profiles?.full_name?.charAt(0) || (f.type === 'report' ? 'D' : 'A'))}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {f.profiles?.full_name || (f.type === 'report' ? 'Active Driver' : 'Anonymous Driver')}
                                </span>
                            </div>
                            <div className={styles.sentimentBadge} data-sentiment={f.sentiment} style={{ fontSize: '0.7rem' }}>
                                {f.type === 'report'
                                    ? (f.price ? 'Price Update' : 'Service Report')
                                    : `${f.rating} ⭐`}
                            </div>
                        </div>

                        {f.type === 'report' && f.price && (
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                    {f.fuel_type || 'PMS'}: ₦{f.price}
                                </span>
                            </div>
                        )}

                        <p style={{ fontSize: '0.9rem', fontStyle: f.type === 'report' ? 'normal' : 'italic', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {f.comment || (f.type === 'report' ? "Verified station activity." : "")}
                        </p>
                        <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{new Date(f.created_at).toLocaleDateString()}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {f.type === 'report' ? (
                                    <span style={{ color: '#3b82f6', fontWeight: 600 }}>Real-time</span>
                                ) : (
                                    !f.response && (
                                        <a href="/dashboard/reputation" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Reply</a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {feedbacks.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No recent activity recorded.</p>
                )}
            </div>

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <a href="/dashboard/reputation" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>See All Reviews →</a>
            </div>

            <ScoutProfileModal
                isOpen={isScoutModalOpen}
                onClose={() => setIsScoutModalOpen(false)}
                data={scoutData}
                isLoading={isScoutLoading}
            />
        </div>
    );
}
