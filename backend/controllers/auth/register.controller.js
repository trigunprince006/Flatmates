const userModel = require("../../models/user.model");
const tempUserModel = require("../../models/otp.Model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {

  const { fullname, phoneNumber, email, userProfile } = req.body;

  if (!fullname || !phoneNumber || !email){
    return res.json({
      status:400,
      message: "Please,fill all the field",
    });
  }

  const isUserExist = await userModel.findOne({ phoneNumber });

  const isTempUserExist = await tempUserModel.findOne({ phoneNumber });

  if (isTempUserExist && isUserExist) {

    await tempUserModel.findByIdAndDelete(isTempUserExist._id);

    return res.json({
      status:400,
      message: "User already registered",
    });

  }

  if (!isTempUserExist) {
    return res.json({
      status:400,
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

    return res.json({
      status:201,
      message: "User Registered successfully"
    });
  }

}

//This Function will be generate and send otp for register.

async function generateOtp(req, res) {

  const { fullname, email, phoneNumber } = req.body;

  if (!fullname || !phoneNumber || !email) {
    return res.json({
      status:400,
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

      } 
      else {

        if (!waitUntil) {

          isTempUserExist.waitingForNextOtp = new Date(
            Date.now() + 5 * 60 * 1000
          );
          await isTempUserExist.save();
        }

        return res.json({
          status:429,
          message: "OTP limit reached. Please try again after 5 minutes.",
        });
      }

    }

    const generatedOtp = randomize("0", 4);

    isTempUserExist.isVerified = false;
    isTempUserExist.otp = generatedOtp;
    isTempUserExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isTempUserExist.howManyTimesOtpGenerated += 1;
    await isTempUserExist.save();

    await sendOtp(generatedOtp, phoneNumber);

    return res.json({
      status:200,
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

  return res.json({
    status:200,
    message: "Otp is sent successfully",
  });

}

//This function wil be verify the otp for registering user.

async function verifyOtp(req, res) {

  const { fullname, email, phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.json({
      status:400,
      message: "Please,fill all the field",
    });

  }

  const isTempUserExist = await tempUserModel.findOne({ phoneNumber });

  if (!isTempUserExist) {
    return res.json({
      status:400,
      message: "Otp is not generated yet",
    });

  }

  if (isTempUserExist.otpExpiresAt < new Date()) {
    return res.json({
      status:400,
      message: "Otp is expired!",
    });

  }

  if (isTempUserExist.otp !== otp) {

    if (isTempUserExist.attempt >= 3) {

      isTempUserExist.otp = null;
      isTempUserExist.attempt = 0;
      await isTempUserExist.save();

      return res.json({
        status:400,
        message: "You otp attempt is over ,Please generate new OTP",
      });

    }

    isTempUserExist.attempt += 1;
    await isTempUserExist.save();

    return res.json({
      status:400,
      message: "Otp is Incorrect",
    });

  }

  isTempUserExist.isVerified = true;
  isTempUserExist.attempt = 0;
  await isTempUserExist.save();

  return res.json({
    status:200,
    message: "Your Phone number is verified Successfully",
  });
  
}
module.exports = { registerUser, generateOtp, verifyOtp };
