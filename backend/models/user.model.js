const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    otp:{
      type:String
    },
    isLoggedIn:{
      type:Boolean,
      default:false
    },
    attempt:{
      type:Number,
      default:0
    },
    howManyTimesOtpGenerated:{
      type:Number,
      default:1
    },
    otpExpiresAt: {
      type: Date
     },
     waitingForNextOtp:{
      type:Date,
     },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    userProfile: {
      age: {
        type: Number,
        min: 0,
        max: 120,
      },
      jobRole: {
        type: String,
      },
      relationshipStatus: {
        type: String,
        enum: ["bachelors", "family"],
        default: "bachelors",
      },
      profilePhoto: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
