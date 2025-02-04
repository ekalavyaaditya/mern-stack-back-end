const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization")
const User = require("../moduels/User");
const jwt = require('jsonwebtoken');
const config = require("../config/keys");
const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator")

router.get("/", auth, async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select("password name email role");
    const user = await User.findById(req.user.id).select("role name email ");
    res.json(user);
  }
  catch (error) {
    console.error(error.message);
  }
});

router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "password is required"
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body
      let user = await User.findOne({ email: email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid user name or password" }] });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid usename or password" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token, role: user.role });
        }
      );
      // res.send("User created");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
