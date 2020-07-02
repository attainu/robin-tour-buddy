const Review = require('./../models/reviewModel');
const factory = require('./factoryHandler');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.postReview = catchAsync(async(req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).populate({
        path: 'bookedTours',
        fields: 'tour user'
    })
    const tour = await Tour.findOne({ _id: req.params.tourId }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if (String(user.bookedTours.tour._id) === String(tour._id)) {
        const newReview = await Review.create({
            user: req.user._id,
            tour: tour._id,
            rating: req.body.rating,
            review: req.body.review
        })
        res.status(200).json({
            status: 'success',
            newReview
        })
    }
})