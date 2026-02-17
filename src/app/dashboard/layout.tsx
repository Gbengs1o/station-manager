import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import styles from './DashboardLayout.module.css';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Check manager verification status
    const { data: managerProfile } = await supabase
        .from('manager_profiles')
        .select('verification_status')
        .eq('id', user.id)
        .maybeSingle();

    if (!managerProfile) {
        return redirect('/register');
    }

    if (managerProfile.verification_status !== 'verified') {
        return redirect('/register/pending');
    }

    return (
        <div className={styles.dashboardWrapper}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <main className={styles.mainContent}>
                    <div className="container" style={{ margin: 0, maxWidth: 'none', padding: 0 }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
