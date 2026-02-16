'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleStockStatus(stationId: number, isOutOfStock: boolean) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('stations')
        .update({ is_out_of_stock: isOutOfStock })
        .eq('id', stationId);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/pricing');

    return { success: true };
}
