const stripe = require('stripe')('sk_test_51GxqeJLgFGfdIbJfAy6VDzuChSYomZawaFrHsYLq0O03CpGRFu9vYOSLq3aD7zn41k2VrkmsimATKHK8NyxCVt4I009lN4Mku2');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');
const User = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    // console.log(tour);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${
        req.params.tourId
      }&user=${req.user.id}&price=${tour.price}`,
      // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
          {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                  `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
              ],
              amount: tour.price * 100,
              currency: 'inr',
              quantity: 1
          }
      ]
});

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = async (req, res, next) => {
    const { tour, user, price } = req.query
    if(!tour && !user && !price) return next()
    const book = await Booking.create({ tour, user, price });
    const userBooking = await User.findOne({ _id: req.user._id })
    userBooking.bookedTours = book
    await userBooking.save()
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect(fullUrl.split('?')[0])
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);