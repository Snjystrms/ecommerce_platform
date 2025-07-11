export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/razorpay',
      handler: 'order.createOrder',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/razorpay/verify',
      handler: 'order.verifyPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 