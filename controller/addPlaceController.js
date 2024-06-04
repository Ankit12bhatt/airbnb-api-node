/* eslint-disable no-underscore-dangle */
const { successResponse, errorResponse, log } = require("../utils/response");
const Place = require("../model/places");
const booking = require("../model/booking");
const User = require("../model/user");

const addPlace = async (req, res) => {
  try {
    const queryObject = {};
    queryObject.services = req.body.services.split(",");
    const userId = req.userDetails.userInfo._id;
    const limit = await Place.countDocuments({ userId });
    if (limit >= 10) {
      return res
        .status(400)
        .json(
          errorResponse("Limit of 10 places has been reached for this user."),
        );
    }
    const imagePaths = req.files.map((file) => file.filename);

    const newPlace = new Place({
      userId,
      title: req.body.title,
      description: req.body.description,
      address: {
        houseNo: req.body.address.houseNo,
        streetAddress: req.body.address.streetAddress,
        landmark: req.body.address.landmark,
        state: req.body.address.state,
        country: req.body.address.country,
        pin: req.body.address.pin,
      },
      price: {
        fixedPrice: req.body.price.fixedPrice,
        dayBasedDiscount: req.body.price.dayBasedDiscount,
        fiveDayDiscount: req.body.price.fiveDayDiscount,
      },
      fees: {
        cleaningService: req.body.fees.cleaningService,
        otherService: req.body.fees.otherService,
      },
      capacity: req.body.capacity,
      services: queryObject.services,
      images: imagePaths,
    });
    const exists = await Place.find({ userId, title: req.body.title });
    if (exists.length > 0) {
      return res
        .status(400)
        .json(successResponse(exists, "place Already exists"));
    }
    await newPlace.save();
    return res
      .status(201)
      .json(successResponse(newPlace, "Place added successfully."));
  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse());
  }
};
const deletePlace = async (req, res) => {
  try {
    const id = req.query.placeId;
    const userId = req.userDetails.userInfo._id;
    const place = await Place.findOne({ _id: id, userId });
    if (!place) {
      return res.status(404).json(errorResponse("Place not found"));
    }
    const result = await Place.findOneAndDelete(place);
    if (!result) {
      return res.status(200).json(errorResponse("Place don't exist"));
    }
    return res
      .status(201)
      .json(successResponse(result, "Deleted Successfully"));
  } catch (error) {
    return res.status(500).json(errorResponse());
  }
};

const updatePlace = async (req, res) => {
  try {
    console.log(req);
    const id = req.query.placeId;
    const userId = req.userDetails.userInfo._id;
    const place = await Place.findOne({ _id: id, userId });

    if (!place) {
      return res.status(404).json(errorResponse("Place not found"));
    }
    log(place);

    const result = await Place.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true },
    ).populate("userId");

    if (!result) {
      return res
        .status(404)
        .json(errorResponse("Place not found or no changes applied"));
    }

    return res
      .status(200)
      .json(successResponse(result, "Place updated successfully"));
  } catch (error) {
    return res.status(500).json(errorResponse());
  }
};

const getAllListing = async (req, res) => {
  try {
    const user = req.userDetails.userInfo._id;
    const result = await Place.find({ userId: user });
    if (result <= 0) {
      return res.status(200).json(successResponse(null, "No listed Places"));
    }
    return res.status(200).json(successResponse(result, "Your listed Places"));
  } catch (err) {
    log(err);
    return res.status(500).json(errorResponse());
  }
};
/**
 * Retrieve bookings for a specific place that have not yet ended.
 * @async
 * @param {Object} req - Express request object should
 * have a place id for checking the booking of a place for today and future.
 *  "POINT NOT A BOOKING HISTORY API".
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
const getBooking = async (req, res) => {
  try {
    const today = new Date().toISOString();
    const id = req.query.placeId;
    const result = await booking.find({
      placeId: id,
      fromDate: { $gte: today },
      toDate: { $gt: today },
    });
    if (result.length > 0) {
      return res
        .status(200)
        .json(
          successResponse(
            result,
            "Booking result Please update the status for them",
          ),
        );
    }
    return res
      .status(200)
      .json(successResponse(null, "No bookings for your products"));
  } catch (err) {
    log(err);
    return res.status(500).json(errorResponse());
  }
};

const bookingStatusUpdate = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const { status } = req.body;
    const result = await booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status } },
      { new: true },
    );
    return res.status(200).json(successResponse(result, "updated record"));
  } catch (err) {
    log(err);
    return res.status(500).json(errorResponse());
  }
};

const becomeHost = async (req, res) => {
  try {
    console.log(req.userDetails);
    const userId = req.userDetails.userInfo._id;
    const result = await User.findOneAndUpdate({ _id: userId }, { $set: { isHost: true } });
    if (!result) {
      return res.status(401).json(errorResponse("can't become host at the moment "));
    }
    return res.status(200).json(successResponse(null, "Please login again for the new features and  add the place "));
  } catch (err) {
    log(err);
    return res.status(500).json(errorResponse());
  }
};
module.exports = {
  addPlace,
  deletePlace,
  updatePlace,
  getAllListing,
  getBooking,
  bookingStatusUpdate,
  becomeHost,
};
