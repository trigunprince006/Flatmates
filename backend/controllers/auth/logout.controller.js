const userModel = require("../../models/user.model");
const tempUserModel = require("../../models/temp.user.model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function logout(req, res) {
  return res.status(200).json({
    message:"Logout function is working perfectly"
  })
}

module.exports = logout;

