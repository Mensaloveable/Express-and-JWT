const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(
      token,
      "3d77eb3b0761cce8e26d188e3961c0d9b28b46750045b34a288ce58afbc08555",
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          console.log(decodedToken);
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
      "3d77eb3b0761cce8e26d188e3961c0d9b28b46750045b34a288ce58afbc08555",
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
