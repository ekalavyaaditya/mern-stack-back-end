const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const router = express();
const Payment = require('../moduels/payment');

router.use(cors()); // Enable CORS for the React frontend

// Set up Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_X5t56BSYv4Rlco',
  key_secret: 'mPPBE1Smd5KZjQQ7RJ5Al1mF',
});

// Create an order
router.post('/', async (req, res) => {
  const { amount, userId, products } = req.body; // Expect amount in rupees

  // Validate request body
  if (!amount || !userId || !products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    const options = {
      amount: amount * 100, // Convert rupees to paise
      currency: 'INR',
      receipt: `order_receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // Save payment details in MongoDB
    const payment = new Payment({
      userId,
      products, // List of product IDs
      amount: order.amount,
      amount_due: order.amount_due,
      amount_paid: order.amount_paid,
      attempts: order.attempts,
      razorpay_order_id: order.id,
      receipt: order.receipt,
      status: order.status,
    });
    await payment.save();
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
});

module.exports = router;