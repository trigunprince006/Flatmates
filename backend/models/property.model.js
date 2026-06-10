const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  address:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  bhk:{
    type:Number,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  bedrooms:{
    type:Number,
    required:true
  },
  bathroom:{
    type:Number,
    required:true
  },
  furnishingStatus:{
    type:String,
    required:true
  },
  images:{
    type:[],
    required:true
  },
  listedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Brokers',
    required:true
  },
  status:{
    type:String,
    enum:['active','booked'],
    default:'active'
  }
},{timestamps:true})

const propertyModel = mongoose.model('Properties',propertySchema)
module.exports = propertyModel;