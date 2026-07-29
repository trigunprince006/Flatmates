const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({

  senderId:{
    type:String,
    required:true
  },
  receiverId:{
    // type:mongoose.Schema.Types.ObjectId,
    type:String,
    // ref:'Brokers',
    required:true
  },
  propertyId:{
    type:String,
    required:true
  },
  messages:{
    type:[String],
  }
},{timestamps:true});

const conversationModel = mongoose.model("Conversations",conversationSchema);
module.exports = conversationModel;
