const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref :'Users',
    required:true,
  },
  refreshToken : {
    type:String,
    defaultL:'null'
  },
  deviceType : {
    type:Object,
  },
  browserType:{
    type:Object
  },
  OsType:{
    type:Object
  },
  ipAddress : {
    type:String,
  },
  userAgent : {
    type:String,
  },
  isRevoked:{
    type:Boolean
  },
  expiresAt:{
    type:Date
  }

},{timestamps:true})

const sessionModel = mongoose.model("sessions",sessionSchema)
module.exports = sessionModel;