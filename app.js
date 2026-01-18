if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const { listingJoiSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const mongoURL = process.env.MONGO_ATLAS;
// console.log("MY CONNECTION STRING IS:", mongoURL);

//====================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(cookieParser("thisismysecret"));

const store = MongoStore.create({
   mongoUrl: mongoURL,
   crypto : {
    secret:process.env.SECRET
   },
   touchAfter: 24 * 3600 // time period in seconds
})

store.on('error', ()=> {
  console.log('ERROR IN MONGO SESSION STORE',err);
})

const sessionOpt = {
  store,
  secret: process.env.SECRET, // Used to sign the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Save empty sessions (useful for login)
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOpt));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============
//DB
// const MONGO_URL = "mongodb://127.0.0.1:27017/Restcasa";

main()
  .then(() => {
    console.log("DB connection Success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoURL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//================
//Routes

//home
// app.get("/", (req, res) => {
//   res.send("HOME");
//   console.dir(req.cookies);
// });

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeuser = new User({
    email: "abc@gmail.com",
    username: "test1",
  });
  let registeredUser = await User.register(fakeuser, "123abc");
  res.send(registeredUser);
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// app.get("/test", (req, res) => {
//     // Check if we have seen this user before
//     if (req.session.count) {
//         req.session.count++; // Increment the count in the locker
//     } else {
//         req.session.count = 1; // Initialize the count
//     }

//     res.send(`You have viewed this page ${req.session.count} times`);
// });

// app.get('/register',(req,res) =>{
//   let { name = 'anonyous'} = req.query;
//   req.session.name = name;
//   req.flash('success', 'User Registerd!')
//   res.redirect('/check');
// }
// );

// app.get('/check',(req,res)=>{
//   let msg = req.flash('success');

//   res.send(`Welcome back ${req.session.name}. Message: ${msg}`);
// })

// app.get("/test", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Cozy Mountain Cabin",
//     description:
//       "A peaceful wooden cabin with scenic mountain views, perfect for weekend relaxation.",
//     image: "https://i.pinimg.com/736x/2d/c0/82/2dc082b497390a07c20ee5affd83247c.jpg",
//     price: 3200,
//     location: "Manali",
//     contry: "India",
//   });
//   await sampleListing.save();
//   console.log('listing saved');
//   res.send('listing saved')
// });

//error handler
// app.use((err,req,res,next) => {
//   res.send('wrong')
// })

// app.get("/getcookie", (req, res) => {
//     // Add the 'signed: true' option
//     res.cookie("color", "red");
//     res.send("Signed cookie sent!");
// });

// // Version 2: Dynamic (From URL)
// // Example URL: http://localhost:8080/setname?name=Sahil
// app.get("/setname", (req, res) => {
//     let { name = "Anonymous" } = req.query; // Grabs 'name' from URL or uses default

//     res.cookie("user_name", name); // Sets cookie dynamically
//     res.send(`We set your name cookie to: ${name}`);
// });

// // To check if it worked (Read the cookie)
// app.get("/check", (req, res) => {
//     console.log(req.cookies); // Prints to terminal
//     res.send(`Welcome back, ${req.cookies.user_name || "Stranger"}!`);
// });

//signed cookie
// app.get("/getsigned", (req, res) => {
//     // Browser receives something like: s%3Ared.K8s7d8s... (Value + Signature)
//     res.cookie("color", "red", { signed: true });
//     res.send("Signed cookie sent!");
// });
// app.get("/verify", (req, res) => {
//     // If the user changed the value in the browser, this will be empty/false
//     console.log(req.signedCookies);
//     res.send(`Your color is ${req.signedCookies.color}`);
// });

app.listen(8080, () => {
  console.log("server start on 8080");
});
