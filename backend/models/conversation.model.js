const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users',
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Brokers',
    required:true
  },
  messages:{
    type:[String],
    
  }
},{timestamps:true});

const conversationModel = mongoose.model("Conversations",conversationSchema);
module.exports = conversationModel;
