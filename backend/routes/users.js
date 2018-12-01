const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/users');

/**
 * POST: signup users
 */
router.post('/signup', (req,res,next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: 'Invalid authentication credentials! Email may already be used!'
        });
      })
  });
});

router.post('/login', (req,res,next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
     // console.log(user);
        if (!user) {
          console.log('No user!');
          return res.status(401).json({
            message: 'Invalid credentials!'
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        console.log('No result!');
        return res.status(401).json({
          message: 'No stored result for entered information!'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
           '8Pl9mm8iM9NnHazSdDcl',
           {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      });
    });
});

/**
 * GET: signup users
 */


module.exports = router;
