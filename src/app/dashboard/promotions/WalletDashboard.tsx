'use client';

import { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { initializeTransaction } from '@/app/dashboard/promotions/actions';
import styles from './promotions.module.css';

interface WalletDashboardProps {
    wallet: any;
    transactions: any[];
}

export default function WalletDashboard({ wallet, transactions }: WalletDashboardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('2000');

    const handleTopUp = async () => {
        const amount = parseInt(topUpAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        try {
            const result = await initializeTransaction(amount);
            if (result.authorization_url) {
                window.location.href = result.authorization_url;
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to initialize payment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.walletContainer}>
            <div className={styles.balanceCard}>
                <div className={styles.balanceHeader}>
                    <span>Available Balance</span>
                    <Wallet size={20} />
                </div>
                <div className={styles.balanceValue}>
                    ₦{wallet?.balance?.toLocaleString() || '0'}
                </div>
                <div className={styles.balanceActions}>
                    <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '12px' }}>
                        <select
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            className={styles.amountSelect}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                flex: 1,
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="1000">₦1,000</option>
                            <option value="2000">₦2,000</option>
                            <option value="5000">₦5,000</option>
                            <option value="10000">₦10,000</option>
                        </select>
                        <button
                            className="btn-primary"
                            onClick={handleTopUp}
                            disabled={isLoading}
                            style={{ flex: 2 }}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <><Plus size={16} /> Top Up</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.historyCard}>
                <div className={styles.historyHeader}>
                    <h3>Recent Transactions</h3>
                    <button className="btn-secondary" style={{ padding: '4px 12px' }}>View All</button>
                </div>
                <div className={styles.transactionList}>
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div key={tx.id} className={styles.transactionItem}>
                                <div className={styles.transactionInfo}>
                                    <h4>{tx.type === 'deposit' ? 'Wallet Top-up' : tx.metadata?.promotion_tier || 'Promotion'}</h4>
                                    <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className={`${styles.amount} ${tx.type === 'deposit' ? styles.amountDeposit : styles.amountSpending}`}>
                                    {tx.type === 'deposit' ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No transactions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
