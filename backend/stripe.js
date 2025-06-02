// backend/stripe.js
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function verifyCard(payment_method_id) {
  const intent = await stripe.paymentIntents.create({
    amount: 1, // $0.01
    currency: 'usd',
    payment_method: payment_method_id,
    confirmation_method: 'manual',
    confirm: true,
    capture_method: 'manual'
  });

  return {
    status: intent.status === 'requires_capture' ? 'LIVE' : 'DEAD',
    paymentIntentId: intent.id
  };
}

module.exports = { verifyCard };
