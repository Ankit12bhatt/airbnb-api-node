/* eslint-disable import/no-extraneous-dependencies */
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().lowercase().required(),
  contact: Joi.string().length(10).required(),
  password: Joi.string().min(3).required(),
});
const bookingValidationSchema = Joi.object({
  userId: Joi.string().length(24).required(),
  placeId: Joi.string().length(24).required(),
  fromDate: Joi.date().iso().min(new Date()).required(),
  toDate: Joi.date().iso().required().greater(Joi.ref("fromDate")),
  capacity: Joi.number().integer().min(1).required(),
  status: Joi.string()
    .valid("pending", "accepted", "rejected")
    .default("pending"),
});
const reviewValidateSchema = Joi.object({
  location: Joi.number().integer().min(1).max(5)
    .required(),
  cleanliness: Joi.number().integer().min(1).max(5)
    .required(),
  accuracy: Joi.number().integer().min(1).max(5)
    .required(),
  communication: Joi.number().integer().min(1).max(5)
    .required(),
  checkIn: Joi.number().integer().min(1).max(5)
    .required(),
  valueForMoney: Joi.number().integer().min(1).max(5)
    .required(),
  feedback: Joi.string().required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  bookingValidationSchema,
  reviewValidateSchema,
};
