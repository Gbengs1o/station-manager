'use client';

import { useState } from 'react';
import { AlertCircle, Zap, ZapOff } from 'lucide-react';
import { toggleStockStatus } from '@/app/dashboard/pricing/stock-actions';
import styles from '@/app/dashboard/dashboard.module.css';

interface StockOutToggleProps {
    stationId: number;
    isOutOfStock: boolean;
}

export default function StockOutToggle({ stationId, isOutOfStock: initialStatus }: StockOutToggleProps) {
    const [isOutOfStock, setIsOutOfStock] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        setIsLoading(true);
        try {
            const newStatus = !isOutOfStock;
            await toggleStockStatus(stationId, newStatus);
            setIsOutOfStock(newStatus);
        } catch (error) {
            console.error('Failed to toggle stock status:', error);
            alert('Failed to update stock status.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.statCard} style={{
            border: isOutOfStock ? '2px solid #ef4444' : '1px solid var(--border)',
            background: isOutOfStock ? 'rgba(239, 68, 68, 0.05)' : 'var(--card-bg)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.statIcon} style={{
                        background: isOutOfStock ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: isOutOfStock ? '#ef4444' : '#22c55e'
                    }}>
                        {isOutOfStock ? <ZapOff size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Stock Availability</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {isOutOfStock ? 'Station marked CLOSED' : 'Accepting drivers'}
                        </p>
                    </div>
                </div>
                <div className={styles.toggleWrapper} onClick={handleToggle} style={{
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                }}>
                    <div className={`${styles.toggle} ${isOutOfStock ? styles.toggleActive : ''}`} style={{
                        background: isOutOfStock ? '#ef4444' : 'var(--border)'
                    }}>
                        <div className={styles.toggleThumb} style={{
                            transform: isOutOfStock ? 'translateX(20px)' : 'translateX(0)'
                        }} />
                    </div>
                </div>
            </div>

            {isOutOfStock && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 600
                }}>
                    <AlertCircle size={14} /> Emergency: Station Hidden from App
                </div>
            )}
        </div>
    );
}
