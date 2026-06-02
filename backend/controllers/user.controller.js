const userModel = require("../models/user.model");
const tempUserModel = require("../models/temp.user.model");
const randomize = require("randomatic");
const sendOtp = require("../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

async function generateOtp(req, res) {
  const { fullname, email, phoneNumber } = req.body;
  if (!fullname || !phoneNumber || !email) {
    return res.status(400).json({
      message: "Please,fill all the field",
    });
  }
  const isTempUserExist = await tempUserModel.findOne({ phoneNumber });
  //This code for  check if user exist and try to generate another otp
  if (isTempUserExist) {
    if (isTempUserExist.howManyTimesOtpGenerated >= 5) {
      const waitUntil = isTempUserExist.waitingForNextOtp;

      if (waitUntil && waitUntil < new Date()) {
        isTempUserExist.howManyTimesOtpGenerated = 0;
        isTempUserExist.waitingForNextOtp = null;
        await isTempUserExist.save();
      } else {
        if (!waitUntil) {
          isTempUserExist.waitingForNextOtp = new Date(
            Date.now() + 5 * 60 * 1000,
          );
          await isTempUserExist.save();
        }
        return res.status(429).json({
          message: "OTP limit reached. Please try again after 5 minutes.",
        });
      }
    }
    const generatedOtp = randomize("0", 4);

    isTempUserExist.otp = generatedOtp;
    isTempUserExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isTempUserExist.howManyTimesOtpGenerated += 1;
    await isTempUserExist.save();
    await sendOtp(generatedOtp, phoneNumber);

    return res.status(200).json({
      message: "Otp is successfully send to your phone number",
    });
  }

  const genratedOtp = randomize("0", 4);

  await tempUserModel.create({
    fullname,
    email,
    phoneNumber,
    isVerified: false,
    otp: generatedOtp,
    howManyTimesOtpGenerated: 1,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  await sendOtp(generatedOtp, phoneNumber);

  return res.status(200).json({
    message: "Otp is successfully send to your phone number",
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
      message: "Please,Generate Otp first!",
    });
  }

  if (isTempUserExist.otpExpiresAt < new Date()) {
    return res.status(400).json({
      message: "Your otp is expired,Please Generate another one",
    });
  }
  if (isTempUserExist.otp !== otp) {
    if (isTempUserExist.attempt >= 3) {
      isTempUserExist.otp = null;
      isTempUserExist.attempt = 0;
      await isTempUserExist.save();

      return res.status(400).json({
        message: "You otp attempt is over ,Please generate new OTP",
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
    message: "Your Phone number is verified Successfully",
  });
}

async function sendOtpForLogin(req, res) {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({
      message: "Please enter phone number",
    });
  }
  const isUserExist = await userModel.findOne({ phoneNumber });
  if (isUserExist) {
    if (isUserExist.howManyTimesOtpGenerated >= 5) {
      const waitUntil = isUserExist.waitingForNextOtp;

      if (waitUntil && waitUntil < new Date()) {
        isUserExist.howManyTimesOtpGenerated = 0;
        isUserExist.waitingForNextOtp = null;
        await isUserExist.save();
      } else {
        if (!waitUntil) {
          isUserExist.waitingForNextOtp = new Date(Date.now() + 5 * 60 * 1000);
          await isUserExist.save();
        }
        return res.status(429).json({
          message: "OTP limit reached. Please try again after 5 minutes.",
        });
      }
    }
    const generatedOtp = randomize("0", 4);
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);

    isUserExist.otp = hashedOtp;
    isUserExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isUserExist.howManyTimesOtpGenerated += 1;
    await isUserExist.save();
    await sendOtp(generatedOtp, phoneNumber);

    return res.status(200).json({
      message: "Otp send to your phone number",
    });
  }

  return res.status(400).json({
    message:
      "User not registered with this phone number,Please register yourself first",
  });
}

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
  console.log(existOtp);
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
  console.log(isMatch);
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

  const token = await jwt.sign({
     userId: isUserExist._id }, 
    process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("Token",token)
  return res.status(200).json({
    message: "User logged in successfully",
    token :token
  });
}

module.exports = {
  registerUser,
  generateOtp,
  verifyOtp,
  sendOtpForLogin,
  login
};
