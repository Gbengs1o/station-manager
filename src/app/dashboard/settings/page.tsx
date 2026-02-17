import { createClient } from '@/utils/supabase/server';
import { updateManagerProfile } from './actions';
import styles from '../dashboard.module.css';
import { User, MapPin, Bell, Shield, LogOut, Save } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch Manager & Station Info
    const { data: profile } = await supabase
        .from('manager_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

    const { data: station } = await supabase
        .from('stations')
        .select('*')
        .eq('id', profile?.station_id)
        .single();

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1>Settings & Preferences</h1>
                    <p>Manage your profile, station details, and app preferences.</p>
                </div>
            </header>

            <div className={styles.mainContent} style={{ maxWidth: '800px' }}>

                {/* 1. Manager Profile Section */}
                <section className={styles.chartArea} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={20} color="var(--primary)" />
                            Manager Profile
                        </h2>
                        <p>Update your personal contact information.</p>
                    </div>

                    <form action={updateManagerProfile} style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={profile?.full_name || ''}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--background)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                defaultValue={profile?.phone_number || ''}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--background)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--background)', // differ slightly to show disabled?
                                    opacity: 0.7,
                                    cursor: 'not-allowed',
                                    color: 'var(--text-secondary)'
                                }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email cannot be changed directly. Contact support.</span>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={16} /> Save Changes
                        </button>
                    </form>
                </section>

                {/* 2. Station Identity (Read-Only) */}
                <section className={styles.chartArea} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={20} color="#eab308" />
                            Station Identity
                        </h2>
                        <p>Station details are verified and cannot be edited manually.</p>
                    </div>

                    <div style={{ display: 'grid', gap: '16px', opacity: 0.9 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'grid', gap: '4px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Station Name</label>
                                <div style={{ fontWeight: 500 }}>{station?.name}</div>
                            </div>
                            <div style={{ display: 'grid', gap: '4px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Brand Affiliation</label>
                                <div style={{ fontWeight: 500 }}>{station?.brand}</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gap: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</label>
                            <div style={{ fontWeight: 500 }}>{station?.address}, {station?.city}, {station?.state}</div>
                        </div>
                    </div>
                </section>

                {/* 3. Notifications (Mock UI) */}
                <section className={styles.chartArea} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bell size={20} color="#a855f7" />
                            Notifications
                        </h2>
                        <p>Manage how we communicate with you.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {['Low Stock Alerts', 'Competitor Price Changes', 'Weekly Analytics Report'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                                <span>{item}</span>
                                <div style={{
                                    width: '40px',
                                    height: '24px',
                                    background: i === 0 ? 'var(--primary)' : 'var(--border)',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        background: '#fff',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '3px',
                                        left: i === 0 ? '19px' : '3px',
                                        transition: 'left 0.2s'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Security */}
                <section className={styles.chartArea} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '20px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={20} color="#ef4444" />
                            Security
                        </h2>
                    </div>

                    <form action="/auth/signout" method="post">
                        <button type="submit" className="btn-danger" style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            <LogOut size={18} /> Sign Out
                        </button>
                    </form>
                </section>

            </div>
        </div>
    );
}
