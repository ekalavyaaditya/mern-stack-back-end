const express = require("express");
const router = express.Router();
const { isEmpty } = require("lodash");
const auth = require("../middleware/authorization");
const Product = require("../moduels/product");
const Cart = require("../moduels/cart");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const carts = await Cart.find({ userId });
    if (isEmpty(carts)) {
      return res.send({ products: [] });
    }
    let retrievedcart;
    carts.forEach((cart) => {
      if (!cart.fullfilled) {
        retrievedcart = cart;
      }
    });
    let products = [];
    let result;
    if (!isEmpty(retrievedcart)) {
      products = retrievedcart.products.map(
        async (product) => await Product.findById({ _id: product })
      );
      products = await Promise.all(products);
      result = { ...retrievedcart.toJSON(), products };
    }
    res.send({ result });
  } catch (error) {
    res.send(500);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const cartId = req.params.id;
    const product = req.body.product;
    const cart = await Cart.update(
      { _id: cartId },
      { $pullAll: { products: [product] } }
    );
    res.send({ cart });
  } catch (error) {
    res.send(500);
  }
});

// router.post("/",auth,async (req,res)=>{
//     try{
//         const userId = req.user.id;
//         const {products}=res.body;
//         let cart, unfulfiledCart;
//         const carts = await Cart.find({userId});
//         const hasValidCarts = carts.reduce((acc,value)=>{
//             if(!value.fullfilled){
//                 unfulfiledCart = value
//             }
//             return acc && value.fulfilled;
//         },true);
//         if(hasValidCarts){
//             cart = new Cart ({userId, products})
//             cart = await cart.save();
//         }else{
//             const stringProduct = [
//                 ...unfulfiledCart.products, ...products
//             ].map((product)=>product.ToSting());
//             const newProducts = array.from(new Set(stringProduct))
//             cart = await Cart.findByIdAndUpdate(
//                 {_id: unfulfiledCart._id},
//                 {products: newProducts}
//             );
//         }
//         let value = cart.products.map(async(id)=>await product.findById(id));
//         value = await Promise.all(value);
//         res.send({...cart.toJOSN(), product:value})
//     } catch(err){
//         res.send(err);
//     }
// })
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { products } = req.body; // Fixed typo: res.body to req.body
    let cart, unfulfilledCart; // Fixed typo: unfulfiledCart to unfulfilledCart
    const carts = await Cart.find({ userId });
    const hasValidCarts = carts.reduce((acc, value) => {
      if (!value.fulfilled) {
        unfulfilledCart = value; // Capture the first unfulfilled cart
      }
      return acc && value.fulfilled;
    }, true);

    if (hasValidCarts) {
      cart = new Cart({ userId, products });
      cart = await cart.save();
    } else {
      const stringProducts = [...unfulfilledCart.products, ...products].map(
        (product) => product.toString()
      ); // Fixed typo: ToSting to toString

      const newProducts = Array.from(new Set(stringProducts)); // Fixed typo: array.from to Array.from
      cart = await Cart.findByIdAndUpdate(
        unfulfilledCart._id,
        { products: newProducts },
        { new: true } // Add option to return the updated cart
      );
    }

    const productPromises = cart.products.map(
      async (id) => await Product.findById(id)
    ); // Ensure 'Product' is capitalized
    const productDetails = await Promise.all(productPromises);

    res.send({ ...cart.toJSON(), products: productDetails }); // Fixed typo: toJOSN to toJSON
  } catch (err) {
  res.status(500).send(err);
  }
});

module.exports = router;
