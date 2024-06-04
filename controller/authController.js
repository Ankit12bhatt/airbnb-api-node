/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/environmentConfig");
const User = require("../model/user");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res) => {
  try {
    const lowerCaseEmail = req.body.email.toLowerCase();
    const userInfo = await User.findOne({
      $or: [{ email: lowerCaseEmail }, { contact: req.body.contact }],
    });
    if (userInfo) {
      return res
        .status(400)
        .json(successResponse(null, "Email or contact number already registered"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: lowerCaseEmail,
      password: hashedPass,
      contact: req.body.contact,
    });
    const result = await newUser.save();
    if (result) {
      return res
        .status(200)
        .json(successResponse(null, "userRegisterd"));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(errorResponse());
  }
};

const login = async (req, res) => {
  const lowerCaseEmail = req.body.email.toLowerCase();
  try {
    const userInfo = await User.findOne({ email: lowerCaseEmail });
    if (!userInfo) {
      return res
        .status(200)
        .json(successResponse(null, "Invalid username!!"));
    }
    const validatePass = await bcrypt.compare(
      req.body.password,
      userInfo.password,
    );
    if (validatePass) {
      const token = jwt.sign({ userInfo }, config.SECRETKEY, {
        expiresIn: "8h",
      });

      return res.status(200).json(successResponse(token, "Logged in successfully"));
    }
    return res
      .status(400)
      .json(successResponse(null, "Invalid Password"));
  } catch (err) {
    return res.status(400).json(errorResponse());
  }
};

module.exports = { register, login };
