/* eslint-disable no-underscore-dangle */
const { successResponse, errorResponse } = require("../utils/response");
const booking = require("../model/booking");
const Review = require("../model/review");

const addReview = async (req, res) => {
  try {
    const date = new Date().toISOString();
    const userId = req.userDetails.userInfo._id;
    const { placeId } = req.query;
    const result = await booking.find({
      userId, placeId, toDate: { $lt: date }, status: "accepted",
    });
    if (result.length > 0) {
      const userReview = await Review.findOne({ userId, placeId });
      const overAllRating = (req.body.accuracy
        + req.body.cleanliness + req.body.location
        + req.body.communication + req.body.checkIn
        + req.body.valueForMoney) / 6;
      if (userReview === null) {
        const newReview = new Review({
          userId,
          placeId,
          location: req.body.location,
          cleanliness: req.body.cleanliness,
          accuracy: req.body.accuracy,
          communication: req.body.communication,
          checkIn: req.body.checkIn,
          valueForMoney: req.body.valueForMoney,
          overAllRating,
          feedback: req.body.feedback,

        });
        const reviewStatus = await newReview.save();
        console.log("review Status =", reviewStatus);
        return res.status(200).json(successResponse(null, "Review Added"));
      }
      return res.status(200).json(successResponse(userReview, "review Already Posted"));
    }
    return res.status(200).json(successResponse(null, "Please complete your stay first"));
  } catch (err) {
    return res.status(500).json(errorResponse());
  }
};

const eligibleReview = async (req, res) => {
  try {
    const date = new Date().toISOString();
    const userId = req.userDetails.userInfo._id;
    const result = await booking.find({ userId, toDate: { $lt: date }, status: "accepted" });
    if (result.length <= 0) {
      return res.status(200).json(successResponse(result, "Sorry!! first book and wait for stay to complete"));
    }
    return res.status(200).json(successResponse(result, "You can add your reviews only for these places as of now"));
  } catch (err) {
    return res.status(500).json(errorResponse());
  }
};

const deleteReview = async (req, res) => {
  try {
    const userId = req.userDetails.userInfo._id;
    const { placeId } = req.query;
    const result = await Review.findOneAndDelete({ userId, placeId });
    if (!result) {
      return res.status(400).json(errorResponse("can't delete at the momment"));
    }
    return res.status(200).json(successResponse(result, "Review Deleted"));
  } catch (err) {
    return res.status(500).json(errorResponse());
  }
};

const getRating = async (req, res) => {
  try {
    const result = await Review.find({ placeId: req.query.placeId }, { _id: 0, overAllRating: 1 });
    if (result.length > 0) {
      let totalRating = 0;
      result.forEach((review) => {
        totalRating += review.overAllRating;
      });
      const averageRating = totalRating / result.length;
      return res.status(200).json(successResponse(averageRating, "Average rating is"));
    }
    return res.status(404).json(successResponse(null, "No reviews found for the specified placeId."));
  } catch (err) {
    console.log(err);
    return res.status(500).json(errorResponse());
  }
};

module.exports = {
  addReview, eligibleReview, deleteReview, getRating,
};
