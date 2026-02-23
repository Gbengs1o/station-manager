-- Fix RLS for station_promotions table
-- Run this in the Supabase SQL Editor

-- 1. Enable RLS on station_promotions if not already enabled
ALTER TABLE station_promotions ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to select promotions (usually public or authenticated)
CREATE POLICY "Anyone can view active promotions"
ON station_promotions
FOR SELECT
USING (true);

-- 3. Allow authenticated users to insert their own promotions
CREATE POLICY "Users can insert their own promotions"
ON station_promotions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 4. Allow users to update their own promotions
CREATE POLICY "Users can update their own promotions"
ON station_promotions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
