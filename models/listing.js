const mongoose = require("mongoose");
const Review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url : String,
    filename : String
  },
  price: Number,
  location: String,
  contry: String,
  Review: [
    {
      type : Schema.Types.ObjectId,
      ref : 'Review'
    }
  ],
  owner: {
    type : Schema.Types.ObjectId,
    ref : "User"
  }
});

listingSchema.post('findOneAndDelete',async (listing) => {
  if (listing) {
    // If a listing was actually found and deleted...
    
    // Delete all reviews where the _id is inside that listing's Review array
    await Review.deleteMany({ _id: { $in: listing.Review } });
  }
})


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
