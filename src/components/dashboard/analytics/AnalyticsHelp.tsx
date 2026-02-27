'use client';

import React from 'react';
import styles from '@/app/dashboard/dashboard.module.css';
import { HelpCircle, Target, Zap, Users, BarChart3, TrendingUp } from 'lucide-react';

const guideItems = [
    {
        icon: <Users size={20} />,
        title: "Community Reach",
        description: "Your brand's total visibility. We combine Profile Views (app exploration), Verified Reports (physical presence), and Driver Favorites (loyalty) into one factual score.",
        tip: "Higher reach means more drivers have you in mind for their next refuel."
    },
    {
        icon: <Zap size={20} />,
        title: "Verified Interactions",
        description: "The 'Heartbeat' of your station. This tracks hard actions like drivers submitting price reports or reviews. It is the most reliable sign of engagement.",
        tip: "Frequent updates in the feed show a healthy, trusted relationship with your drivers."
    },
    {
        icon: <BarChart3 size={20} />,
        title: "Conversion Efficiency",
        description: "Measures your 'Closing Power'. It tracks how many drivers who viewed your station profile actually took an action (visit, report, or review).",
        tip: "If this is low, consider updating your price or running a promotion to entice viewers."
    },
    {
        icon: <TrendingUp size={20} />,
        title: "Capacity Usage",
        description: "Your efficiency at peak hours. It compares your busiest day to the maximum capacity you configure in the settings.",
        tip: "Low usage means you have room to grow! High usage (~90%+) suggests you might need more staff during peaks."
    }
];

export default function AnalyticsHelp() {
    return (
        <section style={{
            marginTop: '64px',
            padding: '40px',
            background: 'var(--card-bg)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ padding: '8px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
                    <HelpCircle size={24} />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Understanding Your Analytics</h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        A guide to using your data to drive station growth.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                {guideItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                            {item.description}
                        </p>
                        <div style={{
                            padding: '12px 16px',
                            background: 'var(--background)',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            borderLeft: '4px solid var(--primary)',
                            fontStyle: 'italic'
                        }}>
                            <strong>Pro Tip:</strong> {item.tip}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '48px',
                padding: '24px',
                background: 'rgba(34, 197, 94, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <Target size={24} color="#22c55e" />
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <strong>Goal for this week:</strong> Aim to increase your <strong>Conversion Efficiency</strong> by keeping your fuel prices updated. Drivers are 3x more likely to visit stations with "Fresh" verified prices.
                </p>
            </div>
        </section>
    );
}
