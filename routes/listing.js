const express = require("express");
const router = express.Router();
const { listingJoiSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner } = require("../middleware.js");
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const listingController = require("../controllers/listing.js");

//  Import multer and your storage
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingJoiSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

router
  .route("/")
  .get(listingController.index)
  .post(
    validateListing,
    isLoggedin,
    upload.single("listing[image]"),
    listingController.createListings
  );
//  .post(
//     upload.single("listing[image]"), 
//     (req, res) => {                  
//         res.send(req.file);
//     }
// );



//new
router.get("/addnewlistings", isLoggedin, listingController.addNewListing);

// router.post('/', validateListing,isLoggedin,listingController.createListings);

//edit
router.get("/:id/edit", isLoggedin, isOwner, listingController.editListing);

router.patch("/:id", isLoggedin, isOwner,upload.single("listing[image]"),  listingController.updateListing);

//delete
    
router.delete("/:id", isLoggedin,isOwner, listingController.deleteListing);

//show
router.get("/:id", listingController.showListings);

module.exports = router;
