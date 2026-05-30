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
    otp:Number,
    isVerified:{
      type:Boolean,
      default:false
    },
    attempt:{
      type:Number,
      default:0
    }
  },{timestamps:true})

const tempUserModel = mongoose.model("tempUsers", tempUserSchema);

module.exports = tempUserModel;
