'use client';

import { MessageCircle, Star, User } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

interface Feedback {
    id: string;
    comment: string;
    rating: number;
    sentiment: string;
    created_at: string;
}

interface FeedbackSnapshotProps {
    feedbacks: Feedback[];
}

export default function FeedbackSnapshot({ feedbacks }: FeedbackSnapshotProps) {
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
                {feedbacks.slice(0, 3).map((f) => (
                    <div key={f.id} className={styles.competitorCard} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <User size={12} /> Anonymous Driver
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                                {f.rating} ⭐
                            </div>
                        </div>
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            &quot;{f.comment}&quot;
                        </p>
                        <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            {new Date(f.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
                {feedbacks.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No recent feedback recorded.</p>
                )}
            </div>

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <a href="/dashboard/reputation" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>See All Reviews →</a>
            </div>
        </div>
    );
}
