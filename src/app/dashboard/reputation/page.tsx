import { createClient } from '@/utils/supabase/server';
import styles from '../dashboard.module.css';
import TrustScoreCards from '@/components/dashboard/reputation/TrustScoreCards';
import ReviewList from '@/components/dashboard/reputation/ReviewList';
import VerificationProgress from '@/components/dashboard/reputation/VerificationProgress';
import ReputationHelp from '@/components/dashboard/reputation/ReputationHelp';

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
        .select('rating_meter')
        .eq('station_id', station?.id);

    const { count: reportsCount } = await supabase
        .from('price_reports')
        .select('*', { count: 'exact', head: true })
        .eq('station_id', station?.id);

    const { count: verificationsCount } = await supabase
        .from('price_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('station_id', station?.id);

    // 3. Fetch Reviews & Price Reports with User Profile
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('station_id', station?.id)
        .order('created_at', { ascending: false });

    const { data: pReports } = await supabase
        .from('price_reports')
        .select('*, profiles:user_id(full_name, avatar_url)')
        .eq('station_id', station?.id)
        .order('created_at', { ascending: false });

    // 4. Unify into a single activity feed
    const unifiedFeed = [
        ...(reviews || []).map((r: any) => ({ ...r, type: 'review' })),
        ...(pReports || []).map((p: any) => ({
            ...p,
            type: 'report',
            rating: p.rating || 5,
            comment: p.notes
        }))
    ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Real logic for aggregate scores
    const totalReviews = reviews?.length || 0;
    const reviewsWithMeter = reviews?.filter(r => r.rating_meter !== undefined && r.rating_meter !== null) || [];

    // Meter Accuracy Aggregation: (RatingMeter from Reviews + MeterAccuracy from Reports)
    // Map accuracy 100 -> 5.0, failure -> 1.0. If null, assume 5.0 (Trust by Default)
    const reportMeterScores = (pReports || []).map(p => p.meter_accuracy === 100 || p.meter_accuracy === null ? 5 : 1);
    const combinedMeterScores = [
        ...reviewsWithMeter.map(r => r.rating_meter),
        ...reportMeterScores
    ];

    const meterRating = combinedMeterScores.length
        ? combinedMeterScores.reduce((acc, val) => acc + (val || 0), 0) / combinedMeterScores.length
        : 5.0; // Optimistic Baseline (Sync with Mobile App)

    // Real Trust Points Calculation (Gamified)
    // 1. Verification Base: 300 pts
    const verificationPoints = station?.is_verified ? 300 : 0;

    // 2. Meter Accuracy: Up to 300 pts (Based on reports + reviews)
    const accuracyCountFromReviews = reviewsWithMeter.filter(r => (r.rating_meter || 0) >= 4).length;

    // In "Trust by Default" Mode, we only count explicit failures as negatives
    const accuracyFailureFromReports = (pReports || []).filter(p => p.meter_accuracy !== null && p.meter_accuracy !== 100).length;
    const totalChecks = combinedMeterScores.length;

    const accuracyRatio = totalChecks
        ? (combinedMeterScores.filter(s => (s || 0) >= 4).length / totalChecks)
        : 1.0; // Optimistic Baseline
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
    const avgReviewScore = totalReviews ? reviewAvg / totalReviews : 5.0; // Optimistic Baseline

    const weightedRating = (
        (accuracyRatio * 5 * 0.4) +
        (avgReviewScore * 0.4) +
        ((station?.is_verified ? 5 : 0) * 0.2)
    );
    // Every station baselines at 5.0 (100% in app terms)
    const displayRating = (totalReviews > 0 || (reportsCount || 0) > 0) ? weightedRating.toFixed(1) : '5.0';

    // MOBILE APP SYNC: Trust Score as Percentage
    const trustScorePercent = Math.round((Number(displayRating) / 5) * 100);

    // GOLD STATUS MILESTONES (Sync with Mobile App)
    const milestones = {
        trustScoreGte90: trustScorePercent >= 90,
        reviewsGte10: (totalReviews + (reportsCount || 0)) >= 10,
        responseRateGte90: totalReviews > 0 ? (responseCount / totalReviews) >= 0.9 : true
    };

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
                    <ReputationHelp />
                    <TrustScoreCards
                        meterRating={meterRating}
                        totalReviews={totalReviews}
                        totalReports={reportsCount || 0}
                        overallRating={trustScorePercent.toString() + '%'} // Show as %
                        isVerified={station?.is_verified || false}
                    />

                    <ReviewList reviews={unifiedFeed} />
                </div>

                <div>
                    <VerificationProgress
                        isVerified={station?.is_verified || false}
                        milestones={milestones}
                    />
                </div>
            </div>
        </div>
    );
}
