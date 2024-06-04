const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    location: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    accuracy: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    checkIn: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    overAllRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("review", reviewSchema);
