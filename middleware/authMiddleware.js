const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const jwtSecret = process.env.JWT_SECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(
      token,
      jwtSecret,
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {

    jwt.verify(
      token,
      jwtSecret,
      async (err, decodedToken) => {
    
        if (err) {
          res.locals.user = null;
    
        } else {
    
          const user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
    
        }
      });
  } else {
    res.locals.user = null;
    next();
  }

};

module.exports = { requireAuth, checkUser };
