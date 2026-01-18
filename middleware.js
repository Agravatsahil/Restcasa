const Listing = require("./models/listing.js");


module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash('error','Please Login or Signup for create new listing.')    
    return res.redirect('/login')
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash('error','You dont have permission to access.');
    return res.redirect(`/listings/${id}`);
  }
  next();
}