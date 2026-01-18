const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true

    }
})

// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);
console.log(`here is error${passportLocalMongoose}`);

const User = mongoose.model("User", userSchema);
module.exports = User;
