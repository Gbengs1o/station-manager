export default function Contact() {
    return (
        <div className="container" style={{ padding: '6rem 2rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Get in <span style={{ color: 'var(--primary)' }}>Touch</span></h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    Have questions about registering your station or need technical support?
                    Our team is here to help you 24/7.
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                        <textarea
                            placeholder="How can we help?"
                            rows={5}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        ></textarea>
                    </div>
                    <button type="button" className="btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    );
}
