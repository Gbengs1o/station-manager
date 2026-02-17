import { createClient } from '@/utils/supabase/client';

export async function checkAndOverrideStock(stationId: number) {
    const supabase = createClient();

    // 1. Check for "No Fuel" reports in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
        .from('price_reports')
        .select('*', { count: 'exact', head: true })
        .eq('station_id', stationId)
        .eq('availability_status', 'No Fuel') // Assuming this is the status string
        .gte('created_at', twoHoursAgo);

    if (error) {
        console.error('Error checking stock reports:', error);
        return null;
    }

    // 2. Logic: If >= 5 reports, valid ground truth established
    if ((count || 0) >= 5) {
        // 3. Override Station Status
        const { error: updateError } = await supabase
            .from('stations')
            .update({ is_out_of_stock: true })
            .eq('id', stationId);

        if (!updateError) {
            return { overridden: true, count };
        }
    }

    return { overridden: false, count };
}
