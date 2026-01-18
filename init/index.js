const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require('./data.js');

//===============
//DB
const MONGO_URL = "mongodb://127.0.0.1:27017/Restcasa";

main()
  .then(() => {
    console.log("DB connection Success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,owner : '696241ac1e3deb3a3a08ff4d'
    }))
    await Listing.insertMany(initData.data);
    console.log('initialize');
}

initDB();