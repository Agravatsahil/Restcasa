const Listing = require("../models/listing.js");



module.exports.index = async (req,res,next) => {
  try {
    const allListings = await Listing.find({});
  res.render('./listings/index.ejs', {allListings});
  } catch (error) {
    next(err);
  }
};

module.exports.addNewListing = (req,res) => {
  res.render('./listings/addnewlistings.ejs');
};

module.exports.createListings =  async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,filename);
    const listData = new Listing(req.body); 
    listData.owner = req.user._id;
    listData.image = { url, filename };
    await listData.save();    
    req.flash('success','New Listing Added Successfully!')              
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
};

module.exports.showListings = async (req,res)=> {
  let {id} = req.params;
  console.log(id);
 const listing = await Listing.findById(id).populate("Review").populate("owner").populate({
            path: "Review",
            populate: {
                path: "author",
            },
        });;
 if(!listing){
    req.flash('error','Listing Already Deleted! You cant access that.')              
    res.redirect('/listings')
 }
 console.log(listing);
  res.render('./listings/show.ejs' , {listing});
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
};

// controllers/listing.js
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  
  // 1. Update text data
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // 2. Check if a NEW image was uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); // Save only if image changed
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
    req.flash('success','Deleted Successfully!')              
  
  res.redirect('/listings');
}