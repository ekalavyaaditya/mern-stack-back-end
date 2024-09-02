const mongoose = require ("mongoose")
const product = require("./product")
const Schema = mongoose.Schema;
const cartSchema = new mongoose.Schema({
    products:{
        type:[Schema.Types.ObjectId],
        required: true
    },
    userId:{
     type:Schema.Types.ObjectId,   
     required: true
    },
    fullfilled:{
        type: Boolean,
        default:false,
    },        
},
{Timestamp:true}
);

const Cart = mongoose.model("Cart",cartSchema);
module.exports = Cart;