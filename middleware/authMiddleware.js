/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const config = require("../config/environmentConfig");

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, config.SECRETKEY);
    req.userDetails = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
