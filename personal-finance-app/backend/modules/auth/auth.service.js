const userModel = require("./auth.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signUp = async ({ name, email, password }) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return "ALREADY_EXISTS";
  }

  const user = await userModel.create({ name, email, password });

  return user;
};

exports.signIn = async ({ email, password }) => {
  const user = await userModel.findOne({ email }).select("+tokenVersion");
  if (!user) {
    return "INVALID_CREDENTIALS";
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return "INVALID_CREDENTIALS";
  }

  const payLoad = {
    userId: user._id,
    tokenVersion: user.tokenVersion || 0,
  };

  const accessToken = await jwt.sign(payLoad, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return accessToken;
};

exports.currentUser = async (userId) => {
  const existsUser = await userModel.findById(userId).select("-password");
  return existsUser;
};

exports.logout = async (userId) => {
  return userModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
};
