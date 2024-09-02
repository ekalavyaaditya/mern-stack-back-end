const express = require("express");
const router = express.Router();
const {isEmpty} = require("lodash")
const auth = require("../middleware/authorization")
const Product = require("../moduels/product");
const Cart = require("../moduels/cart");
const product = require("../moduels/product");

router.get("/", auth, async (req,res)=>{
    try {
        const userId = req.user.Id
        const carts = await Cart.find({userId});
        if(isEmpty(carts)){
            return res.send({products:[]})
        }
        let retrievedcart;
        carts.forEach((cart)=>{
            if(!cart.fullfilled){
                retrievedcart = cart;
            }
        });
        let products = []
        let result
        if(!isEmpty(retrievedcart)){
            products = retrievedcart.products.map(async product => await Product.findById({_id: product})
        )
            products = await Promise.all(products)
            result = {...retrievedcart.toJSON(), products}
        }
        res.send({result})
    } catch (error) {
        res.send(500);
    }
});

router.put("/:id", auth,async (req,res)=>{
    try {
        const cartId = req.params.cartId;
        const product = req.body.product;
        const cart = await Cart.update(
            {_id:cartId},
            {$pullAll:{products:[product]}}
        );
        res.send({cart})
    } catch (error) {
        res.send(500)
    }
})

router.post("/",auth,async (req,res)=>{
    try{
        const userId = req.user.id;
        const {products}=res.body;
        let cart, unfulfiledCart;
        const carts = await Cart.find({userId});
        const hasValidCarts = carts.reduce((acc,value)=>{
            if(!value.fullfilled){
                unfulfiledCart = value
            }
            return acc && value.fulfilled;
        },true);
        if(hasValidCarts){
            cart = new Cart ({userId, products})
            cart = await cart.save();
        }else{
            const stringProduct = [
                ...unfulfiledCart.products, ...products
            ].map((product)=>product.ToSting());
            const newProducts = array.from(new Set(stringProduct))
            cart = await Cart.findByIdAndUpdate(
                {_id: unfulfiledCart._id},
                {products: newProducts}
            );
        }
        let value = cart.products.map(async(id)=>await product.findById(id));
        value = await Promise.all(value);
        res.send({...cart.toJOSN(), product:value}) 
    } catch(err){
        res.send(err);
    }
})
module.exports=router;