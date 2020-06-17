const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const router = express.Router()

router
    .route('/')
    .get(tourController.getAllTour)
    .post(authController.protect, tourController.createTour)
router
    .route('/:id') 
    .patch(authController.protect, tourController.updateTour)
    .delete(authController.protect, tourController.deleteTour)

module.exports = router