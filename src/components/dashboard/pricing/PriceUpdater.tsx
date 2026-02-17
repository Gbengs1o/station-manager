'use client';

import { useState, useEffect } from 'react';
import { updateStationPrices } from '@/app/dashboard/pricing/actions';
import { checkAndOverrideStock } from '@/utils/stock-override';
import styles from '@/app/dashboard/dashboard.module.css';

interface PriceUpdaterProps {
    currentPrices: {
        pms: number;
        ago: number;
        dpk: number;
    };
    stationId?: number;
}

export default function PriceUpdater({ currentPrices, stationId }: PriceUpdaterProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (stationId) {
            checkAndOverrideStock(stationId).then(result => {
                if (result?.overridden) {
                    alert(`⚠️ System Alert: ${result.count} users reported "No Fuel" in the last 2 hours. Your station has been marked OUT OF STOCK automatically.`);
                    window.location.reload(); // Reload to reflect status
                }
            });
        }
    }, [stationId]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsUpdating(true);
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        try {
            await updateStationPrices(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update prices. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className={styles.chartArea} style={{ background: 'var(--surface)', border: '1px dashed var(--primary)' }}>
            <div className={styles.sectionHeader}>
                <h2>Instant Price Updater</h2>
                <p>Updates will reflect instantly on the Fynd Fuel customer app.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.priceEditGrid}>
                <div className={styles.priceInputCard}>
                    <label>PMS (Petrol)</label>
                    <div className={styles.inputWrapper}>
                        <span>₦</span>
                        <input type="number" name="pms" defaultValue={currentPrices.pms} step="0.01" required />
                    </div>
                </div>
                <div className={styles.priceInputCard}>
                    <label>AGO (Diesel)</label>
                    <div className={styles.inputWrapper}>
                        <span>₦</span>
                        <input type="number" name="ago" defaultValue={currentPrices.ago} step="0.01" required />
                    </div>
                </div>
                <div className={styles.priceInputCard}>
                    <label>DPK (Kerosene)</label>
                    <div className={styles.inputWrapper}>
                        <span>₦</span>
                        <input type="number" name="dpk" defaultValue={currentPrices.dpk} step="0.01" required />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Publish Changes'}
                    </button>
                    {success && <span className={styles.successMessage}>✅ Prices Updated!</span>}
                </div>
            </form>
        </div>
    );
}
