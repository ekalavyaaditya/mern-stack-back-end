const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const router = express();

router.use(cors()); // Enable CORS for the React frontend

// Set up Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_X5t56BSYv4Rlco',
  key_secret: 'mPPBE1Smd5KZjQQ7RJ5Al1mF',
});

// Create an order
router.post('/', async (req, res) => {
  const { amount } = req.body; // Amount in paise (1 INR = 100 paise)

  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: 'order_receipt_123',
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating Razorpay order' });
  }
});

module.exports = router;