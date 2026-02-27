'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import paystack from '@/utils/paystack';
import { sendLocalShoutout } from '@/services/notification.service';

export async function getWalletInfo() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', user.id)
        .single();

    if (walletError) throw walletError;

    const { data: transactions, error: transError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    if (transError) throw transError;

    return { wallet, transactions };
}

export async function getActivePromotion(stationId: number) {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('station_promotions')
        .select('*, tier:tier_id(*)')
        .eq('station_id', stationId)
        .eq('status', 'active')
        .gt('end_time', now)
        .maybeSingle();

    if (error) {
        console.error('Error fetching active promotion:', error);
        return null;
    }
    return data;
}

export async function getCampaignHistory(stationId: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('station_promotions')
        .select('*, tier:tier_id(*)')
        .eq('station_id', stationId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching campaign history:', error);
        return [];
    }
    return data;
}

export async function getCampaignDetails(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('station_promotions')
        .select('*, tier:tier_id(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching campaign details:', error);
        return null;
    }
    return data;
}

export async function getPromotionClickEvents(promotionId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('promotion_click_events')
        .select('created_at')
        .eq('promotion_id', promotionId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching click events:', error);
        return [];
    }
    return data;
}

export async function getPromotionTiers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('promotion_tiers')
        .select('*')
        .order('price', { ascending: true });

    if (error) throw error;
    return data;
}

export async function activatePromotion(stationId: number, tierId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Fetch Tier details
    const { data: tier, error: tierError } = await supabase
        .from('promotion_tiers')
        .select('*')
        .eq('id', tierId)
        .single();

    if (tierError) throw tierError;

    // 2. Check Wallet Balance
    const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', user.id)
        .single();

    if (walletError) throw walletError;
    if (wallet.balance < tier.price) {
        throw new Error('Insufficient funds in wallet');
    }

    // 3. Execution (Transaction)
    const { error: deductError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - tier.price })
        .eq('id', user.id);

    if (deductError) throw deductError;

    // Record the spending
    await supabase.from('wallet_transactions').insert({
        wallet_id: user.id,
        amount: -tier.price,
        type: 'spending',
        metadata: { promotion_tier: tier.name, station_id: stationId }
    });

    // Activate the promotion
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + tier.duration_hours);

    const { error: promoError } = await supabase.rpc('create_active_promotion', {
        p_station_id: stationId,
        p_tier_id: tierId,
        p_user_id: user.id,
        p_end_time: endTime.toISOString()
    });

    if (promoError) throw promoError;

    // 4. Trigger Push Notification for High-Tier Promos
    if (tier.name === 'Area Takeover' || tier.name === 'Scarcity Hero') {
        await sendLocalShoutout(stationId, tier.name);
    }

    revalidatePath('/dashboard/promotions');
    return { success: true };
}

export async function mockTopUp(amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', user.id)
        .single();

    if (walletError) throw walletError;

    const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + amount })
        .eq('id', user.id);

    if (updateError) throw updateError;

    await supabase.from('wallet_transactions').insert({
        wallet_id: user.id,
        amount: amount,
        type: 'deposit',
        metadata: { method: 'mock_payment' }
    });

    revalidatePath('/dashboard/promotions');
    return { success: true };
}

export async function initializeTransaction(amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    try {
        const response = await paystack.transaction.initialize({
            email: user.email,
            amount: amount * 100, // Paystack uses kobo
            callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/promotions/verify`,
            metadata: {
                user_id: user.id,
                type: 'wallet_topup'
            }
        });

        if (!response.status) throw new Error(response.message);

        return {
            authorization_url: response.data.authorization_url,
            reference: response.data.reference
        };
    } catch (error: any) {
        console.error('Paystack init error:', error);
        throw new Error('Failed to initialize payment');
    }
}

export async function verifyPaystackTransaction(reference: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    try {
        console.log('Verifying Paystack reference:', reference);
        const response = await paystack.transaction.verify(reference);
        console.log('Paystack response status:', response?.data?.status);

        if (response.data.status === 'success') {
            const amount = response.data.amount / 100;

            // Update Wallet
            const { data: wallet } = await supabase
                .from('wallets')
                .select('balance')
                .eq('id', user.id)
                .single();

            console.log('Wallet update result:', { userId: user.id, amount });
            const { error: updateError } = await supabase
                .from('wallets')
                .update({ balance: (wallet?.balance || 0) + amount })
                .eq('id', user.id);

            if (updateError) {
                console.error('Wallet update error:', updateError);
                throw updateError;
            }

            // Record Transaction
            const { error: transError } = await supabase.from('wallet_transactions').insert({
                wallet_id: user.id,
                amount: amount,
                type: 'deposit',
                metadata: {
                    method: 'paystack',
                    reference: reference,
                    channel: response.data.channel
                }
            });

            if (transError) {
                console.error('Transaction record error:', transError);
                throw transError;
            }

            console.log('Top-up successful for user:', user.id);
            revalidatePath('/dashboard/promotions');
            return { success: true };
        }

        return { success: false, message: 'Transaction not successful' };
    } catch (error) {
        console.error('Paystack verify error:', error);
        throw new Error('Failed to verify payment');
    }
}
