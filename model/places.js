const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      houseNo: {
        type: String,
        required: true,
      },
      streetAddress: {
        type: String,
        required: true,
      },
      landmark: String,
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pin: {
        type: String,
        required: true,
      },
    },
    price: {
      fixedPrice: {
        type: Number,
        required: true,
      },
      dayBasedDiscount: Number,
      fiveDayDiscount: Number,
    },
    fees: {
      cleaningService: {
        type: Number,
        required: true,
      },
      otherService: {
        type: Number,
        required: true,
      },
    },
    capacity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("places", placeSchema);
