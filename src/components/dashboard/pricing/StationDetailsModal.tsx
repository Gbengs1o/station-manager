'use client';

import { X, MapPin, User, Tag, Clock } from 'lucide-react';
import styles from '@/app/dashboard/dashboard.module.css';

interface StationDetails {
    id: number;
    name: string;
    brand: string;
    address: string;
    state: string;
    price_pms: number;
    price_ago: number;
    price_dpk: number;
    manager?: {
        full_name: string;
        phone_number: string;
    };
}

interface StationDetailsModalProps {
    station: StationDetails | null;
    onClose: () => void;
}

export default function StationDetailsModal({ station, onClose }: StationDetailsModalProps) {
    if (!station) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <div className={styles.promoIcon} style={{ width: '40px', height: '40px', background: 'var(--primary)' }}>
                            <Tag size={20} />
                        </div>
                        <div>
                            <h3>{station.name}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {station.brand || 'Independent Station'}
                            </span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.modalBody}>
                    <section className={styles.modalSection}>
                        <h4><MapPin size={16} /> Location Info</h4>
                        <div className={styles.detailCard}>
                            <p><strong>Address:</strong> {station.address || 'N/A'}</p>
                            <p><strong>State:</strong> {station.state}</p>
                        </div>
                    </section>

                    <section className={styles.modalSection}>
                        <h4><User size={16} /> Station Management</h4>
                        <div className={styles.detailCard}>
                            {station.manager ? (
                                <>
                                    <p><strong>Manager:</strong> {station.manager.full_name}</p>
                                    <p><strong>Contact:</strong> {station.manager.phone_number}</p>
                                </>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    No manager registered on Fynd Fuel yet.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className={styles.modalSection}>
                        <h4><Tag size={16} /> Current Price List</h4>
                        <div className={styles.priceGrid}>
                            <div className={styles.priceItem}>
                                <span>PMS (Petrol)</span>
                                <strong>₦{station.price_pms}</strong>
                            </div>
                            <div className={styles.priceItem}>
                                <span>AGO (Diesel)</span>
                                <strong>₦{station.price_ago}</strong>
                            </div>
                            <div className={styles.priceItem}>
                                <span>DPK (Kerosene)</span>
                                <strong>₦{station.price_dpk}</strong>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className={styles.modalFooter}>
                    <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
                        Close Profile
                    </button>
                </footer>
            </div>
        </div>
    );
}
