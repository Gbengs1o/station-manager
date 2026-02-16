'use client';

import styles from '@/app/dashboard/dashboard.module.css';

interface PriceLog {
    date: string;
    price: number;
}

interface PriceHistoryChartProps {
    logs: PriceLog[];
    stateAverage: number;
}

export default function PriceHistoryChart({ logs, stateAverage }: PriceHistoryChartProps) {
    // Simple SVG chart mock
    const maxPrice = Math.max(...logs.map(l => l.price), stateAverage) + 10;
    const minPrice = Math.min(...logs.map(l => l.price), stateAverage) - 10;
    const range = maxPrice - minPrice;

    const points = logs.map((log, i) => {
        const x = (i / (logs.length - 1)) * 100;
        const y = 100 - ((log.price - minPrice) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    const stateAvgY = 100 - ((stateAverage - minPrice) / range) * 100;

    return (
        <div className={styles.chartArea}>
            <div className={styles.sectionHeader}>
                <h2>30-Day Price Trend</h2>
                <p>Compare your PMS fluctuations against the state average.</p>
            </div>

            <div className={styles.placeholderChart} style={{ padding: '20px 10px', display: 'block' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '200px', overflow: 'visible' }}>
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="100" y2="0" stroke="var(--border)" strokeWidth="0.1" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeWidth="0.1" />
                    <line x1="0" y1="100" x2="100" y2="100" stroke="var(--border)" strokeWidth="0.1" />

                    {/* State Average Line */}
                    <line x1="0" y1={stateAvgY} x2="100" y2={stateAvgY} stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2" />
                    <text x="2" y={stateAvgY - 2} fill="#f59e0b" style={{ fontSize: '3px', fontWeight: 600 }}>Oyo State Avg: ₦{stateAverage}</text>

                    {/* Your Price Path */}
                    <polyline
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="1"
                        strokeLinejoin="round"
                        points={points}
                    />
                    {/* Data points */}
                    {logs.map((log, i) => (
                        <circle key={i} cx={(i / (logs.length - 1)) * 100} cy={100 - ((log.price - minPrice) / range) * 100} r="1.5" fill="var(--primary)" />
                    ))}
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>30 Days Ago</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Today</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.8rem' }}>Your Price</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderTop: '2px dashed #f59e0b', marginTop: '4px' }}></div>
                    <span style={{ fontSize: '0.8rem' }}>Market Avg</span>
                </div>
            </div>
        </div>
    );
}
