const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route GET api/users
// @desc Test route
// @access Public

router.post(
  '/',
  //using express validator for validations
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res, next) => {
    //sends error from validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //destructure from req.body
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //throws error if user already exists in db
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'user already exists' }] });
      }
      //create an avatar from gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // create user based on req.body
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //salt and hash password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //saves user to db
      await user.save();

      //creates payload to pass into json web token
      const payload = {
        user: {
          id: user.id
        }
      };
      //jason webtoken takes payload
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
