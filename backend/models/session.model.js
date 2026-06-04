const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref :'Users',
    required:true,
  },
  refreshToken : {
    type:String,
    default:null
  },
  device: {
    deviceType:String,
    deviceModel:String,
    deviceCompany:String
  },
  browser:{
    browserName:String,
    browserVersion:String
  },
  Os:{
    OsName:String,
    OsVersion:String 
  },
  ipAddress : {
    type:String,
  },
  userAgent : {
    type:String,
  },
  isRevoked:{
    type:Boolean,
    default:false
  },
  expiresAt:{
    type:Date
  }

},{timestamps:true})

const sessionModel = mongoose.model("sessions",sessionSchema)
module.exports = sessionModel;