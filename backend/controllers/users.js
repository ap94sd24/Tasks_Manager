const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

exports.createUser = (req, res, next) => {
  let newUser;
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    newUser = user;
    user
      .save()
      .then((result) => {
        const token = jwt.sign(
          { email: newUser.email, userId: newUser._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(201).json({
          message: "User created!",
          token: token,
          expiresIn: 3600,
          userId: newUser._id,
          result: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message:
            "Invalid authentication credentials! Email may already be used!",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      // console.log(user);
      if (!user) {
        console.log("No user!");
        return res.status(401).json({
          message: "Invalid credentials!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        console.log("No result!");
        return res.status(401).json({
          message: "No stored result for entered information!",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.getUserInfos = (req, res, next) => {
  User.findOne(
    {
      _id: req.params.id,
    },
    { email: 1, displayname: 1, username: 1 }
  )
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "User not found!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching user failed!",
      });
    });
};
