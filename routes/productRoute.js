const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const { check, validationResult } = require("express-validator");
const Product = require("../moduels/product");

router.post(
  "/",
  [
    auth,
    [
      check("name", "name is require").not().isEmpty(),
      check("description", "description is require").not().isEmpty(),
      check("category", "category is require").not().isEmpty(),
      check("price", "price is require").not().isEmpty(),
      check("quantity", "quantity is require").not().isEmpty(),
      check("brand", "brand is require").not().isEmpty(),
      check("images", "images is require").not().isEmpty(),   
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const { name, description, category, price, brand, quantity, images } = req.body;
      const newProuduct = new Product({
        userId: req.user.id,
        name,
        description,
        category,
        price,
        brand,
        quantity,
        images,
      });
      const product = await newProuduct.save();
      res.json({ product });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server errror");
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/instructors/:id", auth, async (req, res) => {
  try {
    const product = await Product.find({ userId: req.params.id });
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
