const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');


const authMiddleware = async (req, res, next) => {
  // const token = req.header('Authorization').replace('Bearer ', '');
  if (!req.cookies.token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    let user = await Manager.findOne({user:decoded.userId}).select("-password")
    req.user = user;  
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;



