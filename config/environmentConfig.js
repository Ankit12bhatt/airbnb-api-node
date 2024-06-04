/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  SECRETKEY: process.env.SECRETKEY,
  SECRETKEYSTRIPE: process.env.SECRETKEYSTRIPE,
};
