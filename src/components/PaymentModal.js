import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Use Netlify Function for payment processing
const PAYMENT_FUNCTION_URL = '/.netlify/functions/create-payment-intent';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);
    try {
      // 1. Create payment intent using Netlify Function
      const res = await fetch(PAYMENT_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 999, currency: 'usd', description: 'Admitly Pro Upgrade' }),
      });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      if (!data.clientSecret) {
        throw new Error('Invalid response from server');
      }
      
      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });
      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
        return;
      }
      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      if (err.message.includes('<!DOCTYPE')) {
        setError('Backend server is not running. Please start the server first.');
      } else {
        setError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="border-2 border-gray-200 rounded-xl p-3 focus-within:border-blue-500 transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
      )}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            'Pay $9.99'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ isOpen, onSuccess, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upgrade to Pro</h2>
          <p className="text-gray-600">Unlock unlimited analyses and enhanced features</p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">Enhanced AI analysis</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">Unlimited essay analyses</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">Priority support</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">Early access to new features</span>
          </div>
        </div>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-1">$9.99</div>
          <div className="text-gray-500 text-sm">One-time payment</div>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Secure payment powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 