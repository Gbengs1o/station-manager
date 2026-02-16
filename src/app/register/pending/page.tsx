import Link from 'next/link';
import { Logo } from '@/components/Icons';

export default function RegisterPending() {
    return (
        <div style={{ padding: '6rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ width: '100%', maxWidth: '600px', padding: '3rem', background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Logo style={{ width: '80px', height: '80px', color: 'var(--primary)', opacity: 0.2 }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Application Received!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                    Thank you for joining Fynd Fuel. Your manager account application is now under review. We will verify your details and station information shortly.
                </p>

                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid var(--border)', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>What happens next?</h3>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>Our team will verify your station ownership/management.</li>
                        <li>You will receive an email once your account is activated.</li>
                        <li>Activation usually takes between 12-24 hours.</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Return to Home
                    </Link>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Need help? <Link href="/contact" style={{ color: 'var(--primary)', fontWeight: '600' }}>Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
