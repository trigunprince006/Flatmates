const userModel = require("../../models/user.model");
const otpModel = require("../../models/otp.Model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function sendOtpForLogin(req, res) {
  const { phoneNumber } = req.body;
  if (!phoneNumber ) {
    return res.status(400).json({
      message: "Please,Enter valid phone number",
    });
  }
  const isOtpExist = await otpModel.findOne({ phoneNumber });
  //This code for  check if user exist and try to generate another otp
  if (isOtpExist) {
    if (isOtpExist.howManyTimesOtpGenerated >= 5) {
      const waitUntil = isOtpExist.waitingForNextOtp;

      if (waitUntil && waitUntil < new Date()) {
        isOtpExist.howManyTimesOtpGenerated = 0;
        isOtpExist.waitingForNextOtp = null;
        await isOtpExist.save();
      } else {
        if (!waitUntil) {
          isOtpExist.waitingForNextOtp = new Date(
            Date.now() + 5 * 60 * 1000,
          );
          await isOtpExist.save();
        }
        return res.status(429).json({
          message: "OTP limit reached. Please try again after 5 minutes.",
        });
      }
    }
    const generatedOtp = randomize("0", 4);
    const hashedOtp = await bcrypt.hash(generatedOtp,10);

    isOtpExist.otp = hashedOtp;
    isOtpExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isOtpExist.howManyTimesOtpGenerated += 1;
    await isOtpExist.save();

    await sendOtp(generatedOtp, phoneNumber);

    return res.status(200).json({
      message: "Otp is successfully send to your phone number",
    });
  }

  const generatedOtp = randomize("0", 4);
  const hashedOtp = await bcrypt.hash(generatedOtp,10);
  await otpModel.create({
    phoneNumber,
    otp: hashedOtp,
    howManyTimesOtpGenerated: 1,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    purpose:'login'
  });

  await sendOtp(generatedOtp, phoneNumber);

  return res.status(200).json({
    message: "Otp is successfully send to your phone number",
  });
}
module.exports = sendOtpForLogin;