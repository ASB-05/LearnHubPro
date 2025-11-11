const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// --- Middleware ---
// 1. Enable CORS to allow requests from your React app (running on localhost:3000)
app.use(cors());
// 2. Enable Express to parse JSON request bodies
app.use(express.json());


// --- API Endpoint ---
/**
 * @route   POST /api/payment
 * @desc    Simulates processing a payment
 * @access  Public
 */
app.post('/api/payment', (req, res) => {
  console.log('Payment request received:', req.body);

  const { invoiceId, amount, service, paymentMethodType } = req.body;

  // --- Basic Validation ---
  if (!invoiceId || !amount || !paymentMethodType) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required payment information.' 
    });
  }

  // --- Simulate Payment Gateway Processing (e.g., Stripe, Braintree) ---
  // We add a 2-second delay to mimic a real API call.
  console.log(`Processing payment of $${amount} for ${service}...`);

  setTimeout(() => {
    // --- Simulate a successful payment ---
    const transactionId = `TXN-${Date.now()}`;
    console.log(`Payment successful! Transaction ID: ${transactionId}`);

    // Send a 200 OK response back to the frontend
    res.status(200).json({
      success: true,
      transactionId: transactionId,
      message: `Payment for invoice ${invoiceId} processed successfully.`
    });

    // --- To simulate an error (for testing) ---
    // Uncomment this block and comment out the success block above
    /*
    console.error('Payment processing failed.');
    res.status(500).json({
      success: false,
      message: 'Payment gateway declined the transaction.'
    });
    */

  }, 2000); // 2-second simulated delay
});


// --- Start the server ---
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});