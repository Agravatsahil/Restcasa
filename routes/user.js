const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require('../controllers/user.js')

router.get("/signup", userController.signupForm);

router.post("/signup", userController.signupUser);

//login
router.get("/login", userController.loginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userController.loginUser
);

//logout
router.get("/logout", userController.logoutUser);

module.exports = router;
