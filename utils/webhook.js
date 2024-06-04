const express = require("express");
const payment = require("../model/payment");

const router = express.Router();

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    console.log("request is", req);
    const event = req.body;
    console.log("event is ", event);

    switch (event.type) {
      case "checkout.session.completed":
        console.log(event.type);
        console.log(event.data.object.id);
        await payment.findOneAndUpdate({ transactionId: event.data.object.id }, { $set: { status: "accepted" } });
        console.log("Payment Intent Created");
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  },
);

module.exports = router;
