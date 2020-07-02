const express = require('express');
const cancelController = require('../controllers/cancelController')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/', authController.protect, cancelController.cancelTour)

module.exports = router