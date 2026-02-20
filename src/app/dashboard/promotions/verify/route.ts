import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '../actions';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/promotions?status=error&message=No reference found`);
    }

    try {
        const result = await verifyPaystackTransaction(reference);
        if (result.success) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/promotions?status=success`);
        } else {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/promotions?status=failed&message=${result.message}`);
        }
    } catch (error: any) {
        console.error('Verification error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/promotions?status=error&message=${error.message}`);
    }
}
