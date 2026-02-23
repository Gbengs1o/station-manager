-- SQL Migration: Promotion Analytics Initialization
-- Run these in the Supabase SQL Editor to enable real-time tracking

-- 1. Ensure views and clicks columns exist
ALTER TABLE station_promotions 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- 2. Create RPC for atomic view increment
CREATE OR REPLACE FUNCTION increment_promotion_views(promo_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE station_promotions
    SET views = COALESCE(views, 0) + 1
    WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create RPC for atomic click increment
CREATE OR REPLACE FUNCTION increment_promotion_clicks(promo_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE station_promotions
    SET clicks = COALESCE(clicks, 0) + 1
    WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable RLS (if not already enabled) and set policies
-- Assuming station_promotions is already set up with RLS
-- Policy to allow anyone to increment (if needed by consumer app) 
-- OR better: limit to authenticated users if the consumer app requires login.
