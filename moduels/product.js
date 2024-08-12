const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand:{
        type: String,
    },
    created:{
        type: Date,
        default: Date.now(),
    },
    updated:{
        type: Date,
        default: Date.now(),
    },
});

const product = mongoose.model("Product",ProductSchema);
module.exports = product;