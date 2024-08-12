const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authorization");
const Profile = require("../moduels/profile");
const User = require("../moduels/User");
const Product = require("../moduels/product");

router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) {
      return res.status(400).json({ msg: "There is no such profile" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POST route to create or update a profile
router.post(
  "/",
  [
    auth,
    [
      check("address", "Address is required").not().isEmpty(),
      check("bio", "Bio is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      website,
      address,
      bio,
      facebook,
      instagram,
      twitter,
      youtube,
      linkedin,
    } = req.body;

    // Build profile object
    const profileData = {};
    profileData.userId = req.user.id;
    if (website) profileData.website = website;
    if (address) profileData.address = address;
    if (bio) profileData.bio = bio;

    // Build social media object
    profileData.socialMedia = {};
    if (facebook) profileData.socialMedia.facebook = facebook;
    if (instagram) profileData.socialMedia.instagram = instagram;
    if (twitter) profileData.socialMedia.twitter = twitter;
    if (youtube) profileData.socialMedia.youtube = youtube;
    if (linkedin) profileData.socialMedia.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ userId: req.user.id });
      if (profile) {
        // Update profile
        profile = await Profile.findOneAndUpdate(
          { userId: req.user.id },
          { $set: profileData },
          { new: true }
        );
        return res.json(profile);
      }

      // Create new profile
      profile = new Profile(profileData);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
router.delete("/", auth, async (req, res) => {
  try {
    const product = await Product.find({ userId: req.user.id });
      product.forEach(async (product) => {
      await Product.findOneAndRemove({ _id: product._id });
    });
    await Profile.findOneAndRemove({ userId: req.user.id });
    await User.findOneAndRemove({ userId: req.user.id });
    res.json({ msg: "User details got deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;