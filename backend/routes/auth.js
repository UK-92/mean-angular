const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const user = require('../models/user');

router.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, auth");
  response.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});



router.post('/login', (request, response, next) => {
  let fetchedUser;
  User.findOne({ email: request.body.email }).then(user => {
    if (!user) {
      return response.status(401).json({
        error: {
          message: "Auth failed"
        }
      });
    }
    fetchedUser = user;
    return bcrypt.compare(request.body.password, user.password);
  })
    .then(result => {
      if (!result) {
        return response.status(401).json({
          error: {
            message: "Auth failed"
          }
        });
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, "15ea6799-72a6-4daa-90a6-68b2acc28980",
        { expiresIn: "1h" });
      response.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(error => {
      if (!error) {

        response.status(401).json({
          error: {
            message: "Auth failed"
          }
        });
      }
    });
});

router.post('/signup', (request, response, next) => {
  bcrypt.hash(request.body.password, 10).then(hash => {
    const user = new User({
      email: request.body.email,
      password: hash
    });
    user.save().then(res => {
      response.status(201).json({
        message: "Added new user success!!!",
        result: res
      });
    }).catch(error => {
      response.status(500).json({
        error: {
          message: "Not authenticated"
          , error
        }
      });
    });
  });

});

module.exports = router;