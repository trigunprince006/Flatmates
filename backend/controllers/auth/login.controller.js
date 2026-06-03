const userModel = require("../../models/user.model");
const tempUserModel = require("../../models/temp.user.model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
  const existOtp = isUserExist.otp;

  if (!existOtp) {
    return res.status(400).json({
      message: "Otp is not generated yet!",
    });
  }
  if (isUserExist.otpExpiresAt < new Date()) {
    return res.status(400).json({
      message: "Your otp is expired,Please Generate another one",
    });
  }
  const isMatch = await bcrypt.compare(otp, existOtp);
  if (!isMatch) {
    if (isUserExist.attempt >= 3) {
      isUserExist.otp = null;
      isUserExist.attempt = 0;
      await isUserExist.save();
      return res.status(400).json({
        message: "You otp attempt is over ,Please generate new OTP",
      });
    }
    isUserExist.attempt += 1;
    await isUserExist.save();
    return res.status(400).json({
      message: "Otp is Incorrect",
    });
  }
  isUserExist.otp = null;
  isUserExist.howManyTimesOtpGenerated = 0;
  isUserExist.otpExpiresAt = null;
  isUserExist.attempt = 0;
  isUserExist.isLoggedIn = true;
  isUserExist.waitingForNextOtp = null;
  await isUserExist.save();

  const accessToken = await jwt.sign(
    {
      userId: isUserExist._id,
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
  isUserExist.refreshToken = refreshToken;
  await isUserExist.save();
  return res.status(200).json({
    message: "User logged in successfully",
  });
}

module.exports = login;