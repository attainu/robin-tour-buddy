const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFunction');

exports.overview = async (req, res) => {
    const filter = new ApiFeatures(Tour.find(), req.query).filter()
    const tours = await filter.query
    console.log(tours)
    res.render('overview', {
        tours,
        title: 'All Tours'
    })
}

exports.details = async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if(req.user) {
        var user = await User.findOne({ _id: req.user._id })
        var bookings = await Booking.findOne({ user: user._id, tour: tour._id })
        var reviews = await Review.findOne({ user: user._id, tour: tour._id })
        console.log(reviews)
    }
    if (!tour) console.log('no')
    res.render('detail', {
        tour,
        title: tour.name,
        user,
        bookings,
        reviews
    })
}

exports.signup = async (req, res) => {
    const url = req.url
    res.render('signup', {
        title: 'Sign Up',
        url
    })
}

exports.logon = async (req, res) => {
    const url = req.url
    res.render('login', {
        title: 'Log In',
        url
    })
}

exports.getAccount = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    res.render('account', {
        title: `${user.firstName}'s Account`,
    })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });
  
    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    res.status(200).render('booked', {
        title: 'My Tours',
        tours
    });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ user: req.user.id })
    res.status(200).render('reviews', {
        reviews
    })
})
  

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
            name: req.body.name,
            email: req.body.email
      },
      {
            new: true,
            runValidators: true
      }
    );
  
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});

exports.forgotPasswordPage = catchAsync(async(req, res, next) => {
    res.render('forgotPass')
})

exports.resetPassword = catchAsync(async(req, res, next) => {

    res.render('resetPassword', {
        link: req.params.token
    })
})