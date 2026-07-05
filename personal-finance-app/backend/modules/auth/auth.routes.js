const express = require("express");
const authRouter = express.Router();
const {
  signup,
  login,
  logout,
  currentUser,
  updateProfileImage,
  deleteProfileImage,
} = require("./auth.controller");
const validate = require("../middlewares/validate");
const { signUpDto } = require("./dto/sign-up.dto");
const { signInDto } = require("./dto/sign-in.dto");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const upload = require("../middlewares/upload.middleware");

authRouter.post("/signup", validate(signUpDto), signup);
authRouter.post("/login", validate(signInDto), login);
authRouter.post("/logout", isAuthMiddleware, logout);
authRouter.get("/current-user", isAuthMiddleware, currentUser);
authRouter.put(
  "/profile-image",
  isAuthMiddleware,
  upload.single("image"),
  updateProfileImage,
);
authRouter.delete(
  "/profile-image",
  isAuthMiddleware,
  deleteProfileImage,
);

module.exports = authRouter;
