const Cancel = require('../models/cancelModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

exports.cancelTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ name: req.body.tour })
    console.log(tour)
    const cancelRequest = await Cancel.create({
        user: req.user,
        tour: tour.id
    })
    const booking = await Booking.findOne({ tour, user: req.user._id })
    booking.active = false
    await booking.save()
    res.status(200).json({
        status: 'success',
        request: cancelRequest
    })
})
