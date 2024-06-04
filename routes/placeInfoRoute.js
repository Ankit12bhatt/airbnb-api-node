const router = require("express").Router();
const placeInfo = require("../controller/searchPlaceInfoController");
const verify = require("../middleware/authMiddleware");
const { bookingValidationSchema } = require("../validator/authValidator");
const validator = require("../middleware/validator");

router.get("/getPlaces", placeInfo.getAllPlaces);
router.get("/filterPlaces", placeInfo.filterPlaces);
router.post(
  "/bookPlace",
  verify,
  validator(bookingValidationSchema),
  placeInfo.bookPlace,
);
router.get("/status", verify, placeInfo.status);
router.get("/recommendation", placeInfo.recommendSearch);

module.exports = router;
