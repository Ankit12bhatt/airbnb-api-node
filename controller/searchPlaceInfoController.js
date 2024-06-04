/* eslint-disable no-underscore-dangle */
const { successResponse, errorResponse, log } = require("../utils/response");
const Place = require("../model/places");
const Booking = require("../model/booking");

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    return res
      .status(200)
      .json(successResponse(places, "Places fetched successfully."));
  } catch (err) {
    console.error("Error:", err);
    log(err);
    return res.status(500).json(errorResponse("Internal server error."));
  }
};
const filterPlaces = async (req, res) => {
  try {
    const { search } = req.query;
    const regex = new RegExp(search, "i");
    const places = await Place.find({
      $or: [
        { "address.state": regex },
        { "address.country": regex },
        { services: { $elemMatch: { $regex: regex } } },
      ],
    });
    console.log(places);
    if (places.length <= 0) {
      return res
        .status(200)
        .json(
          successResponse(
            places,
            "Place not available for that location try other locaton",
          ),
        );
    }
    return res
      .status(200)
      .json(successResponse(places, "Places fetched successfully."));
  } catch (err) {
    console.error("Error:", err);
    log(err);
    return res.status(500).json(errorResponse("Internal server error."));
  }
};
const bookPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.value.body.placeId);
    if (!place) {
      return res.status(404).json(errorResponse("Place not found"));
    }
    const placeCapacity = place.capacity;
    console.log("place Capacity is ", placeCapacity);
    const existingBookings = await Booking.find({
      $or: [
        {
          userId: req.value.body.userId,
          fromDate: { $lt: new Date(req.value.body.toDate) },
          toDate: { $gt: new Date(req.value.body.fromDate) },
        },
        {
          placeId: req.value.body.placeId,
          fromDate: { $lt: new Date(req.value.body.toDate) },
          toDate: { $gt: new Date(req.value.body.fromDate) },
        },
      ],
    });

    console.log(existingBookings);
    console.log("result of the bookings query:", existingBookings);
    console.log("Number of existing bookings:", existingBookings.length);

    if (existingBookings.length > 0) {
      console.log("inside 1st if");
      return res
        .status(200)
        .json(
          successResponse(
            existingBookings,
            "You already have bookings for the provided date or this place is booked by other",
          ),
        );
    }
    if (placeCapacity < req.value.body.capacity) {
      console.log("inside the if of place capacity", req.value.body.capacity);
      return res
        .status(400)
        .json(
          errorResponse(
            "This place's capacity is less than the required capacity. Please reduce the capacity or choose another place with more capacity.",
          ),
        );
    }
    const { capacity } = req.value.body;
    const numberOfDays = Math.round(
      (new Date(req.value.body.toDate) - new Date(req.value.body.fromDate))
        / (1000 * 60 * 60 * 24),
    );
    let totalDiscount;
    if (numberOfDays >= 5) {
      totalDiscount = place.price.fiveDayDiscount;
    } else {
      totalDiscount = place.price.dayBasedDiscount;
    }
    console.log(`number of days ${numberOfDays}, discount ${totalDiscount}`);

    let totalAmount = place.price.fixedPrice
      + place.fees.cleaningService
      + place.fees.otherService;
    totalAmount -= (totalDiscount / 100) * totalAmount;
    const finalBill = 0.2 * (place.fees.cleaningService + place.fees.otherService) * capacity
      + totalAmount;
    const bill = {
      fixedPrice: place.price.fixedPrice,
      discount: totalDiscount,
      occupnacyCharge: "2%",
      finalBill,
    };

    const newBooking = new Booking({
      userId: req.value.body.userId,
      placeId: req.value.body.placeId,
      fromDate: req.value.body.fromDate,
      toDate: req.value.body.toDate,
      capacity: req.value.body.capacity,
      status: req.value.body.status,
      bill,
    });
    const newBookingResult = await newBooking.save();
    return res
      .status(200)
      .json(successResponse(newBookingResult, "Booking successful"));
  } catch (err) {
    console.log(err);
    log(err);
    return res.status(500).json(errorResponse());
  }
};
const status = async (req, res) => {
  try {
    const today = new Date().toISOString();
    const userId = req.userDetails.userInfo._id;
    const result = await Booking.find({ userId, fromDate: { $gte: today } });
    console.log(result);
    if (result.length === 0) {
      return res
        .status(200)
        .json(successResponse(result, "NO bookings at the moment"));
    }
    return res.status(200).json(successResponse(result, "data fetched"));
  } catch (err) {
    log(err);
    return res.status(500).json(errorResponse());
  }
};
const recommendSearch = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: "$placeId",
          count: { $sum: 1 },
          place: { $addToSet: "$placeId" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "places",
          localField: "_id",
          foreignField: "_id",
          as: "placeDetails",
        },
      },
    ]);
    console.log(result);
    return res.status(200).json(successResponse(result, "most Visited places"));
  } catch (err) {
    log(err);
    return res.status(500).json(errorResponse());
  }
};
module.exports = {
  getAllPlaces,
  filterPlaces,
  bookPlace,
  status,
  recommendSearch,
};
