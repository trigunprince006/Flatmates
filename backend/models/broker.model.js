const mongoose = require('mongoose');

const  brokerSchema = new mongoose.Schema({

  fullname:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  phoneNumber:{
    type:Number,
    required:true,
    unique:true
  },
  password:{
    type:String,
    require:true
  },
  workAs:{
    type:String,
    enum:['individual','agency'],
    default:'individual'
  },
  experience:{
    type:String,
  },
  brokerProfile:{
    profilePhoto:{
      type:String,
    },
    experience:{
    type:String,
    },
    bio:{
      type:String,
    },
   
  },
 refreshToken:{
    type:String
   }
},{timestamp:true})

const brokerModel = mongoose.model('Brokers',brokerSchema);

module.exports = brokerModel;