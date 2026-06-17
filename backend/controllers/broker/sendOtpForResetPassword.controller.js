const otpModel = require("../../models/otp.Model");
const brokerModel = require('../../models/broker.model')
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const randomize = require("randomatic");

async function sendOtpForResetPassword(req, res) {
  try {
    console.log(req.body);
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(500).json({
        message: "Please ,fill all the field",
      });
    }
    const isUserExist = await brokerModel.findOne({phoneNumber});
    if (!isUserExist) {
      return res.status(400).json({
        message: "broker not exist with this phone number",
      });
    }
    //What if One otp is already exit and user genrate another otp so this below code handel that logic
    const isOtpExist = await otpModel.findOne({phoneNumber});
    if (isOtpExist) {
      //Ye dusra otp bhejega but what if otpGenated  3 se jyada ho jaye toh iske liye ye nchhe wala code
      if (isOtpExist.howManyTimesOtpGenerated >= 5) {
        isOtpExist.waitingForNextOtp = new Date(Date() + 5 * 60 + 1000);
        await isOtpExist.save();
        const waitUntil = isOtpExist.waitingForNextOtp;
        if (waituntil && waitUntil < new Date()) {
          isOtpExist.howManyTimesOtpGenerated = 0;
          isOtpExist.waitingForNextOtp = null;
          await isOtpExist.save();
        }
        return res.status(429).json({
          message: "Otp limit is reached , Trg again sometime",
        });
      }
      const generatedOtp = randomize("0", 4);
      const hashedOtp = await bcrypt.hash(generatedOtp, 10);
      isOtpExist.otp = hashedOtp;
      isOtpExist.howManyTimesOtpGenerated + 1;
      isOtpExist.otpExpiresAt = new Date(Date.now()+5*60*1000)
      await isOtpExist.save();
      await sendOtp(generatedOtp, phoneNumber);
      return res.status(200).json({
        message: "OTP is send Successfully",
      });
    }

    //This below code generate a first otp and save it
    const generatedOtp = randomize("0", 4);
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);
    await otpModel.create({
      purpose: "reset",
      phoneNumber,
      otp: hashedOtp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      howManyTimesOtpGenerated: 1,
    });
    await sendOtp(generatedOtp, phoneNumber);
    return res.status(200).json({
      message: "OTP is send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
module.exports = sendOtpForResetPassword;
