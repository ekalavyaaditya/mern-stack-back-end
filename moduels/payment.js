const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const paymentSchema = new Schema ({
    userID:{
        type: Schema.Types.ObjectId,
        required:true
    },
    cartId:{
        type: Schema.Types.ObjectId,
        required: true
    },
},
{timestamps:true});

const Payment = mongoose.model("Payment",paymentSchema)
module.exports = paymentSchema;