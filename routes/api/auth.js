const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
// @route GET api/auth
// @desc Test route
// @access Public

router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});
// @route POST api/auth
// @desc authenticate user and get token
// @access Public
router.post(
  '/',
  //using express validator for validations
  [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password required').exists()
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
      //throws error if no user  exists in db
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'invalid credentials' }] });
      }

      //creates payload to pass into json web token
      const payload = {
        user: {
          id: user.id
        }
      };
      //json webtoken takes payload
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
