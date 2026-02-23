/**
 * Fynd Fuel Mobile Promotion Service
 * This service should be integrated into the mobile (consumer) app.
 * It provides methods to fetch active promotions and track user interactions.
 */

import { createClient } from './supabase/client'; // Adjust path in mobile app

/**
 * Fetches the active promotion for a specific station.
 * @param stationId The ID of the station to check for promotions.
 */
export async function getStationPromotion(stationId: number) {
    const supabase = createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('station_promotions')
        .select('*, tier:tier_id(*)')
        .eq('station_id', stationId)
        .eq('status', 'active')
        .gt('end_time', now)
        .maybeSingle();

    if (error) {
        console.error('Error fetching promotion:', error);
        return null;
    }
    return data;
}

/**
 * Tracks a view/impression for a boosted station.
 * To be called when a station with an active promotion is visible on screen.
 * @param promotionId The ID of the promotion to track.
 */
export async function trackImpression(promotionId: string) {
    const supabase = createClient();

    // Use RPC for atomic increment if available, otherwise fallback to standard update
    const { error } = await supabase.rpc('increment_promotion_views', { promo_id: promotionId });

    if (error) {
        const { data: promo } = await supabase
            .from('station_promotions')
            .select('views')
            .eq('id', promotionId)
            .single();

        await supabase
            .from('station_promotions')
            .update({ views: (promo?.views || 0) + 1 })
            .eq('id', promotionId);
    }
}

/**
 * Tracks a click for a boosted station.
 * To be called when a user selects a station with an active promotion.
 * @param promotionId The ID of the promotion to track.
 */
export async function trackClick(promotionId: string) {
    const supabase = createClient();

    const { error } = await supabase.rpc('increment_promotion_clicks', { promo_id: promotionId });

    if (error) {
        const { data: promo } = await supabase
            .from('station_promotions')
            .select('clicks')
            .eq('id', promotionId)
            .single();

        await supabase
            .from('station_promotions')
            .update({ clicks: (promo?.clicks || 0) + 1 })
            .eq('id', promotionId);
    }
}

/**
 * Helper to determine if a station should have a special map marker.
 */
export function getMarkerStyle(promotion: any) {
    if (!promotion) return 'default';

    const tierName = promotion.tier?.name;
    if (tierName === 'Area Takeover' || tierName === 'Scarcity Hero') return 'mega-boost';
    if (tierName === 'Featured Station') return 'featured';
    return 'standard-boost';
}
