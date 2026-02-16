'use client';

import styles from '@/app/dashboard/dashboard.module.css';

interface RevenuePoint {
    date: string;
    revenue: number;
}

export default function RevenueTrendChart({ data }: { data: RevenuePoint[] }) {
    if (!data || data.length === 0) {
        return (
            <div className={styles.placeholderChart} style={{ height: '300px' }}>
                <p>No revenue data available for this period.</p>
            </div>
        );
    }

    // Sort data by date just in case
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const maxRevenue = Math.max(...sortedData.map(d => d.revenue)) * 1.1; // Add 10% headroom
    const minRevenue = 0;
    const range = maxRevenue - minRevenue || 1;

    // SVG Dimensions
    const width = 800;
    const height = 300;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const getX = (index: number) => padding + (index * (graphWidth / (sortedData.length - 1 || 1)));
    const getY = (revenue: number) => height - padding - ((revenue - minRevenue) / range) * graphHeight;

    const pathD = sortedData.length > 1
        ? sortedData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.revenue)}`).join(' ')
        : `M ${padding} ${height - padding} L ${width - padding} ${height - padding}`;

    // Create fill area (close the path to the bottom)
    const fillPathD = pathD + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
        <div className={styles.chartContainer} style={{ width: '100%', overflowX: 'auto' }}>
            <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines (Horizontal) */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                    const y = height - padding - (tick * graphHeight);
                    return (
                        <g key={tick}>
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="var(--border)"
                                strokeWidth="1"
                                strokeDasharray="4,4"
                            />
                            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-secondary)">
                                ₦{Math.round(minRevenue + tick * range).toLocaleString()}
                            </text>
                        </g>
                    );
                })}

                {/* Area Fill */}
                <path d={fillPathD} fill="url(#revenueGradient)" />

                {/* Line Path */}
                <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points */}
                {sortedData.map((d, i) => (
                    <g key={i}>
                        <circle cx={getX(i)} cy={getY(d.revenue)} r="4" fill="var(--card-bg)" stroke="var(--primary)" strokeWidth="2" />

                        {/* Day Labels */}
                        <text x={getX(i)} y={height - 20} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">
                            {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
