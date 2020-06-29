const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.post('/post-review/:tourId', reviewController.postReview)

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrict('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrict('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrict('user', 'admin'),
        reviewController.deleteReview
    );

module.exports = router;