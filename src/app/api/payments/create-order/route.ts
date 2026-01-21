
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
    try {
        const { bookingId, amount } = await request.json();

        if (!bookingId || !amount) {
            return NextResponse.json(
                { message: 'Booking ID and amount are required' },
                { status: 400 }
            );
        }

        // Initialize Razorpay
        // NOTE: In production, these should be environment variables
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
        });

        const options = {
            amount: Math.round(amount * 100), // amount in lowest denomination (paise)
            currency: 'INR',
            receipt: `receipt_${bookingId.substring(0, 10)}`, // Shorten ID for receipt
            notes: {
                bookingId: bookingId,
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Return public key for frontend
        });

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
