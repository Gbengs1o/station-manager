import { createClient } from '@/utils/supabase/server';
import styles from '../dashboard.module.css';
import TrustScoreCards from '@/components/dashboard/reputation/TrustScoreCards';
import ReviewList from '@/components/dashboard/reputation/ReviewList';
import VerificationProgress from '@/components/dashboard/reputation/VerificationProgress';

export default async function ReputationPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Fetch Manager & Station Info
    const { data: profile } = await supabase
        .from('manager_profiles')
        .select('station_id')
        .eq('id', user?.id)
        .single();

    const { data: station } = await supabase
        .from('stations')
        .select('*')
        .eq('id', profile?.station_id)
        .single();

    // 2. Fetch Aggregated Metrics
    const { data: reviewStats } = await supabase
        .from('reviews')
        .select('rating_meter, rating_quality')
        .eq('station_id', station?.id);

    const { count: reportsCount } = await supabase
        .from('price_reports')
        .select('*', { count: 'exact', head: true })
        .eq('station_id', station?.id);

    const { count: verificationsCount } = await supabase
        .from('price_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('station_id', station?.id);

    // 3. Fetch Reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('station_id', station?.id)
        .order('created_at', { ascending: false });

    // Real logic for aggregate scores
    const totalReviews = reviews?.length || 0;
    const meterRating = totalReviews
        ? (reviews?.reduce((acc, r) => acc + (r.rating_meter || 0), 0) || 0) / totalReviews
        : 0; // Show 0 if no reports yet to be truthful

    const qualityRating = totalReviews
        ? (reviews?.reduce((acc, r) => acc + (r.rating_quality || 0), 0) || 0) / totalReviews
        : 0;

    // Real Trust Points Calculation
    const basePoints = station?.is_verified ? 500 : 200;
    const activityPoints = ((reportsCount || 0) * 10) + ((verificationsCount || 0) * 25);
    const responsePoints = (reviews?.filter(r => r.response).length || 0) * 50;
    const trustPoints = Math.min(basePoints + activityPoints + responsePoints, 1000);

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1>Reputation & Feedback</h1>
                    <p>Monitor your station&apos;s trust scores and engage with your community.</p>
                </div>
            </header>

            <div className={styles.mainContent}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <TrustScoreCards
                        meterRating={meterRating}
                        qualityRating={qualityRating}
                        totalReviews={totalReviews}
                    />

                    <ReviewList reviews={reviews || []} />
                </div>

                <div>
                    <VerificationProgress
                        isVerified={station?.is_verified || false}
                        points={trustPoints}
                    />
                </div>
            </div>
        </div>
    );
}
