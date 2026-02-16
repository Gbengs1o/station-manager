'use client';

import { useState } from 'react';
import { MessageSquare, Calendar, Send, CheckCircle } from 'lucide-react';
import { respondToReview } from '@/app/dashboard/reputation/actions';
import styles from '@/app/dashboard/dashboard.module.css';

interface Review {
    id: string;
    rating: number;
    comment: string;
    sentiment: string;
    created_at: string;
    response: string | null;
    responded_at: string | null;
    user_email?: string;
}

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    const [respondingId, setRespondingId] = useState<string | null>(null);
    const [responseValue, setResponseValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleResponse(reviewId: string) {
        if (!responseValue.trim()) return;
        setIsSubmitting(true);
        try {
            await respondToReview(reviewId, responseValue);
            setRespondingId(null);
            setResponseValue('');
        } catch (error) {
            console.error('Failed to respond:', error);
            alert('Failed to send response.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.chartArea}>
            <div className={styles.sectionHeader}>
                <h2>Customer Feedback</h2>
                <p>Recent reviews and reports from Fynd Fuel users.</p>
            </div>

            <div className={styles.competitorList}>
                {reviews.map((review) => (
                    <div key={review.id} className={styles.competitorCard} style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className={styles.sentimentBadge} data-sentiment={review.sentiment}>
                                    {review.sentiment}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={12} /> {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{ color: 'var(--primary)', fontWeight: 700 }}>
                                {review.rating} ⭐
                            </div>
                        </div>

                        <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>&quot;{review.comment}&quot;</p>

                        {review.response ? (
                            <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '8px' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                    <CheckCircle size={12} /> Your Response
                                </p>
                                <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{review.response}</p>
                            </div>
                        ) : (
                            <div style={{ marginTop: '8px' }}>
                                {respondingId === review.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <textarea
                                            placeholder="Type your apology or response..."
                                            className={styles.input}
                                            style={{ background: 'var(--surface)', border: '1px solid var(--primary)', height: '80px', padding: '12px' }}
                                            value={responseValue}
                                            onChange={(e) => setResponseValue(e.target.value)}
                                        />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                                disabled={isSubmitting}
                                                onClick={() => handleResponse(review.id)}
                                            >
                                                <Send size={14} style={{ marginRight: '6px' }} /> {isSubmitting ? 'Sending...' : 'Send Response'}
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                                onClick={() => setRespondingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                        onClick={() => setRespondingId(review.id)}
                                    >
                                        <MessageSquare size={14} style={{ marginRight: '6px' }} /> Respond to Customer
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {reviews.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No reviews yet for this station.</p>
                )}
            </div>
        </div>
    );
}
