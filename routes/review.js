const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const { listingJoiSchema,reviewSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");

const reviewController = require('../controllers/reviews.js')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};


//reviews 

router.post("/",validateReview, isLoggedin,reviewController.createReview );

//delete review
router.delete('/:reviewId', reviewController.delReview)


module.exports = router;
