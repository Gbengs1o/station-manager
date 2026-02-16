import AboutHero from '@/components/AboutHero';

export default function About() {
    return (
        <main style={{ background: 'var(--background)' }}>
            <AboutHero />

            <div className="container" style={{ padding: '8rem 2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2.5rem', fontWeight: 700 }}>
                        The Future of <span style={{ color: 'var(--primary)' }}>Fuel Management</span>
                    </h2>
                    <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '4rem' }}>
                        Fynd Fuel is more than just a price tracking app. It's a platform built to bridge the gap between
                        at-home consumers and local fuel station managers. In an era of fluctuating prices and varying
                        availability, we provide the tools necessary for transparency, efficiency, and community trust.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        <div style={{ padding: '3rem', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Our Mission</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                To provide reliable, real-time fuel information to every citizen while helping stations manage their output effectively.
                            </p>
                        </div>
                        <div style={{ padding: '3rem', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Transparency</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                We believe in a fair market where quality service and fair pricing are rewarded through user visibility.
                            </p>
                        </div>
                        <div style={{ padding: '3rem', background: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Innovation</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Continuously improving our dashboard and app to include the latest in geographic and data analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
