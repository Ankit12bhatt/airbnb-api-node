/* eslint-disable consistent-return */
// const user = require("../model/user");

const hostType = async (req, res, next) => {
  try {
    if (req.userDetails.userInfo.isHost === false) {
      return res.status(400).json({ message: " Unauthrorized to add data", success: false });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error", success: false, data: err });
  }
};

module.exports = hostType;
