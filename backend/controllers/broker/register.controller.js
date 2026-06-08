const brokerModel = require("../../models/broker.model");
const tempUserModel = require("../../models/otp.Model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerBroker(req, res) {
  try {
    const { fullname, phoneNumber, email, userProfile } = req.body;

    if (!fullname || !phoneNumber || !email) {
      return res.status(400).json({
        message: "Please,fill all the field",
      });
    }
    const isBrokerExist = await brokerModel.findOne({ phoneNumber });
    const isTempBrokerExist = await tempUserModel.findOne({ phoneNumber });

    if (isTempBrokerExist && isBrokerExist) {
      await tempUserModel.findByIdAndDelete(isTempBrokerExist._id);
      return res.status(400).json({
        message: "User already registered",
      });

      if (!isTempBrokerExist) {
        return res.status(400).json({
          message: "Please verify your phone number first",
        });
      }
    }
    let broker;
    if (isTempBrokerExist.isVerified == true) {
      broker = await brokerModel.create({
        fullname,
        email,
        phoneNumber,
        brokerProfile
      });
      await tempUserModel.findByIdAndDelete(isTempUserExist._id);
      return res.status(201).json({
        message: "Broker Registered successfully",
        broker: broker,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function generateOtp(req, res) {
  // console.log("Generate Otp is working...");
  const { fullname, email, phoneNumber } = req.body;
  if (!fullname || !phoneNumber || !email) {
    return res.status(400).json({
      message: "Please,fill all the field",
    });
  }
  const isTempBrokerExist = await tempUserModel.findOne({ phoneNumber });
  //This code for  check if user exist and try to generate another otp
  if (isTempBrokerExist) {
    if (isTempBrokerExist.howManyTimesOtpGenerated >= 5) {
      const waitUntil = isTempBrokerExist.waitingForNextOtp;

      if (waitUntil && waitUntil < new Date()) {
        isTempBrokerExist.howManyTimesOtpGenerated = 0;
        isTempBrokerExist.waitingForNextOtp = null;
        await isTempBrokerExist.save();
      } else {
        if (!waitUntil) {
          isTempBrokerExist.waitingForNextOtp = new Date(
            Date.now() + 5 * 60 * 1000,
          );
          await isTempBrokerExist.save();
        }
        return res.status(429).json({
          message: "OTP limit reached. Please try again after 5 minutes.",
        });
      }
    }
    const generatedOtp = randomize("0", 4);

    isTempBrokerExist.otp = generatedOtp;
    isTempBrokerExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isTempBrokerExist.howManyTimesOtpGenerated += 1;
    await isTempBrokerExist.save();

    await sendOtp(generatedOtp, phoneNumber);

    return res.status(200).json({
      message: "Otp is successfully send to your phone number",
    });
  }

  const generatedOtp = randomize("0", 4);

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
  if (!phoneNumber || !otp) {
    return res.status(400).json({
      message: "Please,fill all the field",
    });
  }
  const isTempBrokerExist = await tempUserModel.findOne({ phoneNumber });

  if (!isTempBrokerExist) {
    return res.status(400).json({
      message: "Please,Generate Otp first!",
    });
  }

  if (isTempBrokerExist.otpExpiresAt < new Date()) {
    return res.status(400).json({
      message: "Your otp is expired,Please Generate another one",
    });
  }
  if (isTempBrokerExist.otp !== otp) {
    if (isTempBrokerExist.attempt >= 3) {
      isTempBrokerExist.otp = null;
      isTempBrokerExist.attempt = 0;
      await isTempBrokerExist.save();

      return res.status(400).json({
        message: "You otp attempt is over ,Please generate new OTP",
      });
    }
    isTempBrokerExist.attempt += 1;
    await isTempBrokerExist.save();
    return res.status(400).json({
      message: "Otp is Incorrect",
    });
  }

  isTempBrokerExist.isVerified = true;
  isTempBrokerExist.attempt = 0;
  await isTempBrokerExist.save();
  return res.status(200).json({
    message: "Your Phone number is verified Successfully",
  });
}
module.exports = { registerBroker, generateOtp, verifyOtp };
