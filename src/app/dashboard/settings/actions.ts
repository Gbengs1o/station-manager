'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateManagerProfile(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const fullName = formData.get('fullName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    const { error } = await supabase
        .from('manager_profiles')
        .update({
            full_name: fullName,
            phone_number: phoneNumber,
        })
        .eq('id', user.id);

    if (error) {
        console.error('Profile update error:', error);
        return { error: 'Failed to update profile' };
    }

    revalidatePath('/dashboard/settings');
    return { success: 'Profile updated successfully' };
}
