'use client';

import styles from '../dashboard.module.css';
import { Flame, Award, Percent, ArrowRight } from 'lucide-react';

export default function PromotionsPage() {
    const handleNotAvailable = () => {
        alert('This feature is currently in development and will be available soon!');
    };

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1>Promotional Tools</h1>
                    <p>Boost your station&apos;s visibility and drive more sales</p>
                </div>
                <button className="btn-primary" onClick={handleNotAvailable}>Create New Promotion</button>
            </header>

            <div className={styles.promoGrid}>
                <div className={styles.promoCard} style={{ '--accent': '#f59e0b' } as any}>
                    <div className={styles.promoIcon}><Flame /></div>
                    <div className={styles.promoContent}>
                        <h3>Flash Sale</h3>
                        <p>Boost traffic immediately with a time-limited price drop.</p>
                        <button className={styles.promoBtn} onClick={handleNotAvailable}>
                            Activate Flash Sale <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                <div className={styles.promoCard} style={{ '--accent': '#9b59ff' } as any}>
                    <div className={styles.promoIcon}><Award /></div>
                    <div className={styles.promoContent}>
                        <h3>Featured Station</h3>
                        <p>Get listed at the top of search results for 24 hours.</p>
                        <button className={styles.promoBtn} onClick={handleNotAvailable}>
                            Go Featured <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                <div className={styles.promoCard} style={{ '--accent': '#10b981' } as any}>
                    <div className={styles.promoIcon}><Percent /></div>
                    <div className={styles.promoContent}>
                        <h3>Loyalty Program</h3>
                        <p>Reward frequent customers with exclusive points/discounts.</p>
                        <button className={styles.promoBtn} onClick={handleNotAvailable}>
                            Manage Rewards <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.promotionHistory}>
                <h2>Campaign Performance</h2>
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Campaign</th>
                                <th>Type</th>
                                <th>Reach</th>
                                <th>Clicks</th>
                                <th>Growth</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Morning Rush Sale</td>
                                <td>Flash Sale</td>
                                <td>12.4k</td>
                                <td>840</td>
                                <td>+15%</td>
                                <td><span className={styles.statusActive}>Active</span></td>
                            </tr>
                            <tr>
                                <td>Lagos Island Drop</td>
                                <td>Featured</td>
                                <td>45k</td>
                                <td>1.2k</td>
                                <td>+22%</td>
                                <td><span className={styles.statusCompleted}>Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
