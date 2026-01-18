const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  
  review.author = req.user._id;
  listing.Review.push(review)

  await review.save()
  await listing.save();
  // console.log(review);
    req.flash('success','Review Added Successfully!')              


  res.redirect(`/listings/${id}`);
}

module.exports.delReview = async (req,res)=> {
  const { id,reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {$pull : {review : reviewId}})
  await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted Successfully!')              

  res.redirect(`/listings/${id}`);
}