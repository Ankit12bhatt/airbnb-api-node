const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const verify = require("../middleware/authMiddleware");
const hostType = require("../middleware/hostType");
const hostControl = require("../controller/addPlaceController");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({ storage });
router.put("/becomeHost", verify, hostControl.becomeHost);
router.post(
  "/place",
  verify,
  hostType,
  upload.array("images", 5),
  hostControl.addPlace,
);
router.delete("/place", verify, hostType, hostControl.deletePlace);
router.put(
  "/place",
  verify,
  hostType,
  upload.array("images", 5),
  hostControl.updatePlace,
);
router.get("/place", verify, hostType, hostControl.getAllListing);
router.get("/place/getBooking", verify, hostType, hostControl.getBooking);
router.put("/place/update", verify, hostType, hostControl.bookingStatusUpdate);

module.exports = router;
