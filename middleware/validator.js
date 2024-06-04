/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const Joi = require("joi");
const { loginSchema, registerSchema, bookingValidationSchema } = require("../validator/authValidator");

const validator = (schema) => (req, res, next) => {
  if (schema === bookingValidationSchema) {
    const userId = req.userDetails.userInfo._id;
    const { placeId } = req.query;
    const requestBody = {
      userId,
      placeId,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
      capacity: req.body.capacity,
      status: "pending",
    };
    const result = schema.validate(requestBody);
    if (result.error) {
      return res.status(400).json({
        error: result.error.details[0].message,
      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value.body = result.value;
  } else {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({
        error: result.error.details[0].message,
      });
    }
    if (!req.value) {
      req.value = {};
    }
    req.value.body = result.value;
  }
  next();
};

module.exports = validator;
