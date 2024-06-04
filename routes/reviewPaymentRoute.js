const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { reviewValidateSchema } = require("../validator/authValidator");
const verify = require("../middleware/validator");
const review = require("../controller/placeReviewController");
const payment = require("../controller/paymentController");

router.get("/review", authMiddleware, review.eligibleReview);
router.post("/review", authMiddleware, verify(reviewValidateSchema), review.addReview);
router.delete("/review", authMiddleware, review.deleteReview);
router.get("/rating", review.getRating);
router.post("/payment", authMiddleware, payment.paymentStatus);

module.exports = router;
