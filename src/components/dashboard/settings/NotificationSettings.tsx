'use client';

import { useState } from 'react';
import { updateNotificationPreferences } from '@/app/dashboard/settings/actions';

interface NotificationSettingsProps {
    initialPreferences: {
        low_stock_alerts: boolean;
        competitor_price_changes: boolean;
        weekly_analytics: boolean;
    };
}

export default function NotificationSettings({ initialPreferences }: NotificationSettingsProps) {
    const [prefs, setPrefs] = useState(initialPreferences);
    const [isUpdating, setIsUpdating] = useState(false);

    const togglePreference = async (key: keyof typeof initialPreferences) => {
        const newPrefs = { ...prefs, [key]: !prefs[key] };
        setPrefs(newPrefs);
        setIsUpdating(true);

        try {
            const result = await updateNotificationPreferences(newPrefs);
            if (result.error) {
                // Rollback on error
                setPrefs(prefs);
                alert(result.error);
            }
        } catch (error) {
            setPrefs(prefs);
            alert('An unexpected error occurred.');
        } finally {
            setIsUpdating(false);
        }
    };

    const items = [
        { key: 'low_stock_alerts' as const, label: 'Low Stock Alerts' },
        { key: 'competitor_price_changes' as const, label: 'Competitor Price Changes' },
        { key: 'weekly_analytics' as const, label: 'Weekly Analytics Report' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: isUpdating ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            {items.map((item, i) => {
                const isActive = prefs[item.key];
                return (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <span>{item.label}</span>
                        <div
                            onClick={() => !isUpdating && togglePreference(item.key)}
                            style={{
                                width: '40px',
                                height: '24px',
                                background: isActive ? 'var(--primary)' : 'var(--border)',
                                borderRadius: '12px',
                                position: 'relative',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                width: '18px',
                                height: '18px',
                                background: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '3px',
                                left: isActive ? '19px' : '3px',
                                transition: 'left 0.2s'
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
