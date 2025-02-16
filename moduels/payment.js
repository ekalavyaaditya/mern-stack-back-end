const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    products: {
        type: [Schema.Types.ObjectId],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    amount_due: {
        type: Number,
        default: 0, // Usually updated after payment
    },
    amount_paid: {
        type: Number,
        default: 0, // Updated once payment is completed
    },
    attempts: {
        type: Number,
        default: 0, // Tracks the number of payment attempts
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically sets the creation timestamp
    },
    currency: {
        type: String,
        default: "INR",
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    receipt: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    },
},
    { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema)
module.exports = Payment;