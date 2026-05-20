import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOptions {
  amount: number; // in INR
  bookingId: string;
  installmentId?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface RetryPaymentOptions {
  bookingId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const handlePayment = async ({
    amount,
    bookingId,
    installmentId,
    onSuccess,
    onError,
  }: PaymentOptions) => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your connection.');
      }

      // 1. Create Order
      const orderData = await api.payments.createOrder(bookingId, installmentId);

      // --- Web & Capacitor: use Razorpay JS SDK flow (Razorpay's modal handles mobile webviews well) ---
      const options = {
        key: orderData.key, // Backend returns 'key', not 'keyId'
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Keel',
        description: 'Nanny Service Payment',
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // 3. Verify Payment
          try {
            await api.payments.verify(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            addToast({ message: 'Payment Successful!', type: 'success' });
            onSuccess();
          } catch (verifyError: any) {
            console.error(verifyError);
            addToast({
              message: verifyError.message || 'Payment Verification Failed',
              type: 'error',
            });
            onError(verifyError.message);
          }
        },
        prefill: {
          name: user?.profiles?.first_name
            ? `${user.profiles.first_name} ${user.profiles.last_name || ''}`
            : 'Parent',
          email: user?.email || 'parent@example.com',
          contact: user?.profiles?.phone || '',
        },
        theme: {
          color: '#059669', // emerald-600
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        addToast({
          message: response.error.description || 'Payment Failed',
          type: 'error',
        });
        onError(response.error.description);
      });
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initialization failed', error);
      addToast({
        message: error.message || 'Could not start payment',
        type: 'error',
      });
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async ({
    bookingId,
    onSuccess,
    onError,
  }: RetryPaymentOptions) => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your connection.');
      }

      // Call retry endpoint to get new order
      const orderData = await api.payments.retryPayment(bookingId);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'CareConnect',
        description: 'Payment Retry',
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            await api.payments.verify(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            addToast({ message: 'Payment Successful!', type: 'success' });
            onSuccess();
          } catch (verifyError: any) {
            console.error(verifyError);
            addToast({
              message: verifyError.message || 'Payment Verification Failed',
              type: 'error',
            });
            onError(verifyError.message);
          }
        },
        prefill: {
          name: user?.profiles?.first_name
            ? `${user.profiles.first_name} ${user.profiles.last_name || ''}`
            : 'Parent',
          email: user?.email || 'parent@example.com',
          contact: user?.profiles?.phone || '',
        },
        theme: {
          color: '#059669',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        addToast({
          message: response.error.description || 'Payment Failed',
          type: 'error',
        });
        onError(response.error.description);
      });
      razorpay.open();
    } catch (error: any) {
      console.error('Payment retry failed', error);
      addToast({
        message: error.message || 'Could not retry payment',
        type: 'error',
      });
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, handleRetryPayment, loading };
};
