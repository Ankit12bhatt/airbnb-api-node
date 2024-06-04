/* eslint-disable import/no-extraneous-dependencies */
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
});

module.exports = limiter;
