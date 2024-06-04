/* eslint-disable import/no-extraneous-dependencies */
const router = require("express").Router();
const authRouter = require("./authRoute");
const hostRoute = require("./hostRoute");
const placeInfoRoute = require("./placeInfoRoute");
const reviewPaymentRoute = require("./reviewPaymentRoute");

router.use("/auth", authRouter);
router.use("/hostRoute", hostRoute);
router.use("/userRoute", placeInfoRoute);
router.use("/reviewPaymentRoute", reviewPaymentRoute);

module.exports = router;
