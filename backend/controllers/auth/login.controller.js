const userModel = require("../../models/user.model");
const otpModel = require("../../models/otp.Model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UAParser = require('ua-parser-js')
const sessionModel = require('../../models/session.model')

async function login(req, res) {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({
      message: "Please enter all credentials",
    });
  }
  const isUserExist = await userModel.findOne({ phoneNumber });
  if (!isUserExist) {
    return res.status(400).json({
      message: "User does't exist,Please register yourself",
    });
  }
  const isOtpExist = await otpModel.findOne({ phoneNumber });
  if (!isOtpExist) {
    return res.status(400).json({
      message: "Otp not generated yet",
    });
  }

  if (isOtpExist.otpExpiresAt < new Date()) {
    return res.status(400).json({
      message: "Your otp is expired,Please Generate another one",
    });
  }
  const existOtp = isOtpExist.otp;
  const isMatch = await bcrypt.compare(otp, existOtp);
  if (!isMatch) {
    if (isOtpExist.attempt >= 3) {
      isOtpExist.otp = null;
      isOtpExist.attempt = 0;
      await isOtpExist.save();
      return res.status(400).json({
        message: "You otp attempt is over ,Please generate new OTP",
      });
    }
    isOtpExist.attempt += 1;
    await isOtpExist.save();
    return res.status(400).json({
      message: "Otp is Incorrect",
    });
  }

  const accessToken = await jwt.sign(
    {
      userId: isUserExist._id,
      role:"user",
      type: "access",
    },
    process.env.ACCESS_JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  const refreshToken = await jwt.sign(
    {
      userId: isUserExist._id,
      role:"user",
      type: "refresh",
    },
    process.env.REFRESH_JWT_SECRET_KEY,
    {
      expiresIn: "90d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });

  await otpModel.findByIdAndDelete(isOtpExist._id);
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();
  // Here u can use Destructuring for better look of code
  const browserName = result.browser.name;
  const browserVersion = result.browser.version;

  const OsName = result.os.name;
  const OsVersion = result.os.version;

  const deviceType = result.device.type || 'Desktop';;
  const deviceModel = result.device.model || 'null';
  const deviceCompany = result.device.vendor || 'null';

  const ipAddress = req.ip;
  const UA = req.headers["user-agent"];
  const userId  = isUserExist._id;
  const session = await sessionModel.find({userId});
  console.log(session)
  /* Here we can implement a features on session management for better login handling for a user with multiple devices login but my mind is note yet able to process and design it so move forward and work on to next features of this project */ 
  // if(session){
  //   if(session.)
  // }

  await sessionModel.create({
    userId: isUserExist._id,
    refreshToken: refreshToken,
    device: {
      deviceType,
      deviceModel,
      deviceCompany,
    },
    userAgent: UA,
    browser: {
      browserName,
      browserVersion,
    },
    Os: {
      OsName,
      OsVersion,
    },
    ipAddress: ipAddress,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });
  return res.status(200).json({
    message: "User logged in successfully",
  });
}

module.exports = login;
