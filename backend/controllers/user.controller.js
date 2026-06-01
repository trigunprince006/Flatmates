const userModel = require("../models/user.model");
const tempUserModel = require("../models/temp.user.model");
const randomize = require("randomatic");
const sendOtp = require("../services/sendOtp");

async function registerUser(req, res) {
  console.log(req.body);
  const { fullname, phoneNumber, email, userProfile } = req.body;

  if (!fullname || !phoneNumber || !email) {
    return res.status(400).json({
      message: "Please,fill all the field",
    });
  }
  const isUserExist = await userModel.findOne({ phoneNumber });
  if (isUserExist) {
    return res.status(400).json({
      message: "User already registred with current phone number",
    });
  }

  const isTempUserExist = await tempUserModel.findOne({ phoneNumber });
  if (!isTempUserExist) {
    return res.status(400).json({
      message: "Please verify your phone number first",
    });
  }
  let user;
  if (isTempUserExist.isVerified == true) {
    user = await userModel.create({
      fullname,
      email,
      phoneNumber,
    });
    await tempUserModel.findByIdAndDelete(isTempUserExist._id);
    return res.status(201).json({
      message: "User Registred succesfully",
      user: user,
    });
  }
}

async function genrateOtp(req, res) {
  const { fullname, email, phoneNumber } = req.body;
  if (!fullname || !phoneNumber || !email) {
    return res.status(400).json({
      message: "Please,fill all the field",
    });
  }
  const isTempUserExist = await tempUserModel.findOne({ phoneNumber });
  //This code for  check if user exist and try to genrate another otp
  if (isTempUserExist) {
    if (isTempUserExist.howManyTimesOtpGenarted >= 5) {
      const waitUntil = isTempUserExist.waitingForNextOtp;

    if (waitUntil && waitUntil < new Date()) {
    // Cooldown has passed — reset and allow
    isTempUserExist.howManyTimesOtpGenarted = 0;
    isTempUserExist.waitingForNextOtp = null;
    await isTempUserExist.save();
  } else {
    // Still in cooldown — set it if not already set
    if (!waitUntil) {
      isTempUserExist.waitingForNextOtp = new Date(Date.now() + 5 * 60 * 1000);
      await isTempUserExist.save();
    }
    return res.status(429).json({
      message: "OTP limit reached. Please try again after 5 minutes.",
    });
  }
}
    const genratedOtp = randomize("0", 4);

    await sendOtp(genratedOtp, phoneNumber);
    isTempUserExist.otp = genratedOtp;
    isTempUserExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isTempUserExist.howManyTimesOtpGenarted += 1;
    await isTempUserExist.save();

    return res.status(200).json({
      message: "Otp is succesfully send to your phone number",
    });
  }

  const genratedOtp = randomize("0", 4);


  await sendOtp(genratedOtp, phoneNumber);

  await tempUserModel.create({
    fullname,
    email,
    phoneNumber,
    isVerified: false,
    otp: genratedOtp,
    howManyTimesOtpGenarted: 1,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return res.status(200).json({
    message: "Otp is succesfully send to your phone number",
  });
}

async function verifyOtp(req, res) {
  const { fullname, email, phoneNumber, otp } = req.body;
  if (!fullname || !phoneNumber || !email || !otp) {
    return res.status(400).json({
      message: "Please,fill all the field",
    });
  }
  const isTempUserExist = await tempUserModel.findOne({ phoneNumber });

  if (!isTempUserExist) {
    return res.status(400).json({
      message: "Please,Genarate Otp first!",
    });
  }

  if (isTempUserExist.otpExpiresAt < new Date()) {
    return res.status(400).json({
      message: "Your otp is exipred,Please Genrate another one",
    });
  }
  if (isTempUserExist.otp !== otp) {
    if (isTempUserExist.attempt >= 3) {
      isTempUserExist.otp = null;
      isTempUserExist.attempt = 0;
      await isTempUserExist.save();

      return res.status(400).json({
        message: "You otp attempt is over ,Plase genarte new OTP",
      });
    }
    isTempUserExist.attempt += 1;
    await isTempUserExist.save();
    return res.status(400).json({
      message: "Otp is Incorrect",
    });
  }

  isTempUserExist.isVerified = true;
  isTempUserExist.attempt = 0;
  await isTempUserExist.save();
  return res.status(200).json({
    message: "Your Phone number is verified Succesfullly",
  });
}

module.exports = { registerUser, genrateOtp, verifyOtp };
