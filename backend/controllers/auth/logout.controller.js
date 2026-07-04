const userModel = require("../../models/user.model");
const tempUserModel = require("../../models/otp.Model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function logout(req, res) {
  return res.json({
    status:200,
    message:"Logout function is working perfectly"
  })
}

module.exports = logout;

