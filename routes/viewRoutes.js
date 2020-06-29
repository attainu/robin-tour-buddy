const express = require('express');
const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, bookingController.createBookingCheckout, viewController.overview)
router.get('/tour/:tourSlug', authController.isLoggedIn, viewController.details)
router.get('/signup', viewController.signup)
router.get('/login', authController.isLoggedIn, viewController.logon)
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);
router.get('/forgot-password', viewController.forgotPasswordPage);
router.get('/reset-password/:token', viewController.resetPassword);
router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

module.exports = router