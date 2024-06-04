/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
const SECRETKEYSTRIPE = require("../config/environmentConfig");
const stripe = require("stripe")(SECRETKEYSTRIPE.SECRETKEYSTRIPE);
const Booking = require("../model/booking");
const payment = require("../model/payment");
const { errorResponse, log } = require("../utils/response");

const paymentStatus = async (req, res) => {
  log("inside");
  const { bookingId } = req.query;
  const product = await Booking.findOne({ _id: bookingId })
    .populate("userId")
    .populate("placeId");
  if (product) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: product.placeId.title,
              description: product.placeId.description,
            },
            unit_amount: product.bill.finalBill * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });
    const result = await payment.findOne({ bookingId });
    if (result === null) {
      await payment.create({
        transactionId: session.id,
        bill: session.amount_total / 100,
        currency: session.currency,
        status: "pending",
        bookingId: product._id,
        userId: product.userId._id,
        placeId: product.placeId._id,
      });
      return res.status(200).json({ url: session.url });
    }
    await payment.findOneAndUpdate(
      { _id: result._id },
      { $set: { transactionId: session.id } },
    );
    return res.status(200).json({ url: session.url });
  }
  return res.status(500).json(errorResponse());
};

module.exports = { paymentStatus };
