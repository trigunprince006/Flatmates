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
        enum: ["bachlors", "family"],
        default: "bachlors",
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
