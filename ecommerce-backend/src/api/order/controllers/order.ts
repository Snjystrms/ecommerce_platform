import { factories } from '@strapi/strapi';
import Razorpay from 'razorpay';
import { Context } from 'koa';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  // Add Razorpay order creation endpoint
  async createOrder(ctx: Context) {
    const { amount, currency, receipt } = ctx.request.body;
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };
    try {
      const order = await razorpay.orders.create(options);
      ctx.send(order);
    } catch (err) {
      ctx.throw(400, 'Unable to create Razorpay order');
    }
  },

  async verifyPayment(ctx: Context) {
    ctx.send({ status: 'ok' });
  },
}));
