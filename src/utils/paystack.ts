/**
 * Custom Paystack utility to avoid dependency issues with 'paystack-api'
 */
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

async function paystackFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.paystack.co${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Paystack API request failed');
    }
    return data;
}

const paystack = {
    transaction: {
        initialize: async (params: { email: string; amount: number; callback_url?: string; metadata?: any }) => {
            return paystackFetch('/transaction/initialize', {
                method: 'POST',
                body: JSON.stringify(params),
            });
        },
        verify: async (reference: string) => {
            return paystackFetch(`/transaction/verify/${reference}`, {
                method: 'GET',
            });
        },
    },
};

export default paystack;
