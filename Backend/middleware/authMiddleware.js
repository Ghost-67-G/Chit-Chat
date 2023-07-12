const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");
// const asyncHandler = require("express-async-handler");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
       jwt.verify(token, "Ayan is awsome",async(err,decoded)=>{
        if(err){
          throw new Error(err)
        }else{
          req.user = await User.findById(decoded.data).select("-password");
          next();
        }
       });
    } catch (error) {
      res.status(401);
    }
  }

  if (!token) {
    res.status(401);
  }
};

module.exports = { protect };
