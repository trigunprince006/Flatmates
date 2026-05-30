const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,

    },
    phoneNumber: {
      type: Number,
    },
    email: {
      type: String,
    },
    otp:String,
    isVerified:{
      type:Boolean,
      default:false
    },
    attempt:{
      type:Number,
      default:0
    },
    howManyTimesOtpGenarted:{
      type:Number,
      default:1
    },
    otpExpiresAt: {
      type: Date
     },
     waitingForNextOtp:{
      type:Date,
     }
  },{timestamps:true})

const tempUserModel = mongoose.model("tempUsers", tempUserSchema);

module.exports = tempUserModel;
