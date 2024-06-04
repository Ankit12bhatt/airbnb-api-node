/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const config = require("./environmentConfig");

const databaseConnect = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("connected to database");
  } catch (err) {
    console.log("Error connecting the database:", err);
  }
};

module.exports = { databaseConnect };
