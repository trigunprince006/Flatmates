const brokerModel = require("../../models/broker.model");
const otpModel = require("../../models/otp.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UAParser = require('ua-parser-js')
const sessionModel = require('../../models/session.model')

async function login(req, res) {

  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({
      message: "Please enter all credentials",
    });
  }

  const isBrokerExist = await brokerModel.findOne({ phoneNumber });


  if (!isBrokerExist) {
    return res.status(400).json({
      message: "Broker does't exist,Please register yourself",
    });
  }

  const isMatch = await bcrypt.compare(password,isBrokerExist.password);

  if(!isMatch){
//Here we should have to implement some limit for entering incorrect password
    return res.status(400).json({
      message: "Password is incorrect"
    });
  }

  const accessToken = await jwt.sign(
    {
      brokerId: isBrokerExist._id,
      role:"broker",
      type: "access",
    },
    process.env.ACCESS_JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    },
  );

  res.cookie("brokerAccessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  const refreshToken = await jwt.sign(
    {
      brokerId: isBrokerExist._id,
      role:"user",
      type: "refresh",
    },
    process.env.REFRESH_JWT_SECRET_KEY,
    {
      expiresIn: "90d",
    },
  );

  res.cookie("brokerRefreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });

  
  isBrokerExist.refreshToken = refreshToken;
  await isBrokerExist.save();

  return res.status(200).json({
    message: "Logged in successfully",
  });
}

module.exports = login;
