/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowecase: true,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
