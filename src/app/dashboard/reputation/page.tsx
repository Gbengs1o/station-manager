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

    // Real Trust Points Calculation (Gamified)
    // 1. Verification Base: 300 pts
    const verificationPoints = station?.is_verified ? 300 : 0;

    // 2. Meter Accuracy: Up to 300 pts (Based on reports)
    // If no reports, give neutral 150. If accurate, 300. If adjusted, 0.
    const accuracyRatio = reportsCount ? (await supabase.from('price_reports').select('*', { count: 'exact', head: true }).eq('station_id', station?.id).eq('meter_accuracy', 100)).count || 0 / reportsCount : 0.5;
    const accuracyPoints = Math.round(accuracyRatio * 300);

    // 3. Community Engagement: Up to 200 pts
    // 50 pts per response, max 200
    const responseCount = reviews?.filter(r => r.response).length || 0;
    const engagementPoints = Math.min(responseCount * 50, 200);

    // 4. Activity/Consistency: Up to 200 pts
    // 10 pts per report/verification
    const activityCount = (reportsCount || 0) + (verificationsCount || 0);
    const consistencypoints = Math.min(activityCount * 10, 200);

    const trustPoints = verificationPoints + accuracyPoints + engagementPoints + consistencypoints;

    // Calculate Star Rating (Weighted)
    // 40% Meter Accuracy, 40% User Reviews, 20% Verification Status
    const reviewAvg = reviews?.reduce((acc, r) => acc + r.rating, 0) || 0;
    const avgReviewScore = totalReviews ? reviewAvg / totalReviews : 0;

    const weightedRating = (
        (accuracyRatio * 5 * 0.4) +
        (avgReviewScore * 0.4) +
        ((station?.is_verified ? 5 : 0) * 0.2)
    );
    // If no data, default to 0 or 4.0 for new stations
    const displayRating = totalReviews > 0 ? weightedRating.toFixed(1) : (station?.is_verified ? '4.0' : '0.0');

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
                        overallRating={displayRating}
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
