
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOptions {
  amount: number; // in INR
  bookingId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const handlePayment = async ({ amount, bookingId, onSuccess, onError }: PaymentOptions) => {
    setLoading(true);
    try {
      // 1. Create Order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, amount }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CareConnect",
        description: "Nanny Service Payment",
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // 3. Verify Payment
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            
            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              addToast({ message: "Payment Successful!", type: 'success' });
              onSuccess();
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (verifyError: any) {
            console.error(verifyError);
            addToast({ message: verifyError.message || "Payment Verification Failed", type: 'error' });
            onError(verifyError.message);
          }
        },
        prefill: {
          name: user?.profiles?.first_name ? `${user.profiles.first_name} ${user.profiles.last_name || ''}` : "Parent",
          email: user?.email || "parent@example.com",
          contact: user?.profiles?.phone || "",
        },
        theme: {
          color: "#059669", // emerald-600
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        addToast({ message: response.error.description || "Payment Failed", type: 'error' });
        onError(response.error.description);
      });
      razorpay.open();
    } catch (error: any) {
      console.error("Payment initialization failed", error);
      addToast({ message: error.message || "Could not start payment", type: 'error' });
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading };
};
