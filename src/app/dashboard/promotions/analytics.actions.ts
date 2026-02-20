'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Tracks an impression (view) for a promotion.
 * To be called by the consumer app when a boosted station is rendered in the list or map.
 */
export async function trackPromotionImpression(promotionId: string) {
    const supabase = await createClient();

    // Increment views in station_promotions
    const { error } = await supabase.rpc('increment_promotion_views', { promo_id: promotionId });

    if (error) {
        // Fallback if RPC doesn't exist yet
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
 * Tracks a click for a promotion.
 * To be called by the consumer app when a user clicks on a boosted station.
 */
export async function trackPromotionClick(promotionId: string) {
    const supabase = await createClient();

    // Increment clicks in station_promotions
    const { error } = await supabase.rpc('increment_promotion_clicks', { promo_id: promotionId });

    if (error) {
        // Fallback
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
