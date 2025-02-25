const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const { check, validationResult } = require("express-validator");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const Product = require("../moduels/product");
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.GCLOUD_KEY_FILE,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2000 * 1024 * 1024,
  },
});

router.post(
  "/",
  [
    auth,
    upload.array("images", 8),
    [
      check("name", "name is require").not().isEmpty(),
      check("description", "description is require").not().isEmpty(),
      check("category", "category is require").not().isEmpty(),
      check("price", "price is require").not().isEmpty(),
      check("quantity", "quantity is require").not().isEmpty(),
      check("brand", "brand is require").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const { name, description, category, price, brand, quantity } = req.body;
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        console.log(
          "📷 Uploaded Files:",
          req.files.map((f) => f.originalname)
        );
        const uploadPromises = req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const blob = bucket.file(Date.now() + "-" + file.originalname);
            const blobStream = blob.createWriteStream({
              resumable: false,
              // contentType: file.mimetype,
              contentType: "image/jpeg",
            });

            blobStream.on("finish", async () => {
              await blob.makePublic();
              const publicUrl = `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${blob.name}`;
              // resolve(
              //   `https://storage.googleapis.com/${process.env.GCLOUD_STORAGE_BUCKET}/${blob.name}`
              // );
              console.log("Uploaded Image URL:", publicUrl);
              resolve(publicUrl);
            });
            blobStream.on("error", (err) => reject(err));
            blobStream.end(file.buffer);
          });
        });
        imageUrls = await Promise.all(uploadPromises);
      }
      console.log("🌐 Final Image URLs:", imageUrls);
      const newProduct = new Product({
        userId: req.user.id,
        name,
        description,
        category,
        price,
        brand,
        quantity,
        images: imageUrls,
      });
      const product = await newProduct.save();
      console.log("Product Saved Successfully:", product);
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
