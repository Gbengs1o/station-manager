-- Fix for promotion insertion using a SECURITY DEFINER function
-- This bypasses RLS and ensures the promotion is always created.
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_active_promotion(
    p_station_id BIGINT,
    p_tier_id UUID,
    p_user_id UUID,
    p_end_time TIMESTAMPTZ
) RETURNS void AS $$
BEGIN
    INSERT INTO station_promotions (
        station_id,
        tier_id,
        user_id,
        end_time,
        status
    ) VALUES (
        p_station_id,
        p_tier_id,
        p_user_id,
        p_end_time,
        'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
