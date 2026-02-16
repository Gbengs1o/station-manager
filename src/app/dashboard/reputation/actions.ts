'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function respondToReview(reviewId: string, response: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('reviews')
        .update({
            response: response,
            responded_at: new Date().toISOString()
        })
        .eq('id', reviewId);

    if (error) throw error;

    revalidatePath('/dashboard/reputation');
    revalidatePath('/dashboard');

    return { success: true };
}
