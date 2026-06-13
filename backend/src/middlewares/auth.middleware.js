const jwt = require('jsonwebtoken');
const AppError = require('../utils/error.utils.js');
const User = require('../models/user.model.js');


async function isLogedIn(req,res,next) {
  const { token } = req.cookies;
  
  if (!token) {
    return next(new AppError("Unauthorised!!", 400));
  }
  
  const decoded = await jwt.verify(token,process.env.JWT_SERECT);
  
  if (!decoded) {
    return next(new AppError("Invalid Token, Unauthorised!!", 400));
  }
  
  const user = await User.findOne({_id:decoded.id});
  
  req.user = user;
  next();
}

module.exports = isLogedIn;