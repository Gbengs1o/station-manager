'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function AppearanceSettings() {
    const { theme, toggleTheme } = useTheme();

    return (
        <section style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginTop: '24px'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 600 }}>
                    <Sun size={20} color="var(--primary)" />
                    Appearance
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                    Customize how FyndFuel looks on your device.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    <span>Dark Mode</span>
                </div>
                <div
                    onClick={toggleTheme}
                    style={{
                        width: '40px',
                        height: '24px',
                        background: theme === 'dark' ? 'var(--primary)' : 'var(--border)',
                        borderRadius: '12px',
                        position: 'relative',
                        cursor: 'pointer',
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
                        left: theme === 'dark' ? '19px' : '3px',
                        transition: 'left 0.2s'
                    }} />
                </div>
            </div>
        </section>
    );
}
