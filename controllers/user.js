const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Create a new user object (but don't save it yet)
    const newUser = new User({ email, username });

    // The Magic Line: This saves the user AND hashes the password
    const registeredUser = await User.register(newUser, password);

    // console.log(registeredUser);

    // Log them in automatically
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); 
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    req.flash("success", "Welcome to RestCasa!");
    // res.redirect("/listings");
  } catch (e) {
    // If username exists or other error, catch it here
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.loginUser =async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    //  Check if there is a saved URL, otherwise go to /listings
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
  };

  module.exports.logoutUser = (req, res, next) => {
    // req.logout() now requires a callback function
    req.logout((err) => {
        if (err) {
            return next(err); // If logout fails, handle the error
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}