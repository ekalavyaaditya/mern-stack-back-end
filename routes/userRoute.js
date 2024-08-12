const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const config = require("../config/keys");
const User = require("../moduels/User")

router.get("/", (req, res) => res.send("user route"));

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with at least 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
      const { name, email, password, role } = req.body
        let user = await User.findOne({ email: email })  
        if(user){
            return res
            .status(400)
            .json({errors:[{ msg:"User already exists" }] })
        }
        user = new User({
            name,
            email,
            password,
            role,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.save();
        const payload ={
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload, 
          config.jwtSecret,
          { expiresIn: 3600 * 24 },
          (err, token)=>{
          if(err) throw err;
          res.json({token});
        }
        );
        // res.send("User created");
    }catch (error){
        console.error(error);
        res.status(500).send("Server error");
    }
  }
);

module.exports = router;
