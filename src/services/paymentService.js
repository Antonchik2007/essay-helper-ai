// Demo payment service - no Stripe dependencies
export const createPaymentIntent = async () => {
  // Simulate payment intent creation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('pi_demo_' + Date.now());
    }, 500);
  });
};

export const processPayment = async () => {
  // Simulate payment processing
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        resolve({
          id: 'pi_demo_' + Date.now(),
          status: 'succeeded',
          amount: 999,
        });
      } else {
        reject(new Error('Payment failed. Please try again.'));
      }
    }, 2000);
  });
};

// For demo purposes, we'll create a simplified payment flow
export const processDemoPayment = async () => {
  return new Promise((resolve, reject) => {
    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        resolve({
          id: 'pi_demo_' + Date.now(),
          status: 'succeeded',
          amount: 999,
        });
      } else {
        reject(new Error('Payment failed. Please try again.'));
      }
    }, 2000);
  });
}; 