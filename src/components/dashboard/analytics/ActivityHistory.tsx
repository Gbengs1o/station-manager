'use client';

import React from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { MessageSquare, Zap, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
    type: 'report' | 'review' | 'price_log';
    created_at: string;
    description: string;
}

export default function ActivityHistory({ activities }: { activities: ActivityItem[] }) {
    if (activities.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Calendar size={40} opacity={0.2} />
                <p>No recent activity detected.</p>
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'report': return <Target size={16} />;
            case 'review': return <MessageSquare size={16} />;
            case 'price_log': return <Zap size={16} />;
            default: return <Calendar size={16} />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'report': return '#22c55e';
            case 'review': return '#a855f7';
            case 'price_log': return '#f97316';
            default: return 'var(--primary)';
        }
    };

    return (
        <div className={styles.activityTimeline}>
            {activities.slice(0, 5).map((activity, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={styles.activityItem}
                    style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px 0',
                        borderBottom: i === activities.length - 1 ? 'none' : '1px solid var(--border)',
                        position: 'relative'
                    }}
                >
                    <div
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: `${getColor(activity.type)}15`,
                            color: getColor(activity.type),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        {getIcon(activity.type)}
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
                            {activity.description}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                            {new Date(activity.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </motion.div>
            ))}
            {activities.length > 5 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '12px', opacity: 0.6 }}>
                    + {activities.length - 5} more recent events
                </p>
            )}
        </div>
    );
}
