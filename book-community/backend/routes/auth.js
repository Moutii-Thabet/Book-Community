import { Router } from "express";

import User from "../models/user.js";

import {
  postSignup,
  postLogin,
  postSendResetPassword,
  getResetPasswordPermission,
  postNewPassword,
} from "../controllers/auth.js";

import { body } from "express-validator";

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email.")
      .custom(async (value, { req }) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          return Promise.reject("User with this Email already exists");
        }
        return true;
      })
      .trim(),
    body("name").custom((value) => {
      if (value.trim().length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }
      return true;
    }),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minSymbols: 0,
        minUppercase: 0,
      })
      .withMessage(
        "Password must have at least 8 characters with one uppercase letter and 1 symbol"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    }),
  ],
  postSignup
);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (!existingUser) {
          return Promise.reject(
            "No user with this email exists, you have to signup"
          );
        }
        return true;
      }),
  ],
  postLogin
);

router.post(
  "/resetpw",
  [
    body("email").custom(async (value) => {
      console.log(value);
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("User with this email does not exist.");
      }
      return true;
    }),
  ],
  postSendResetPassword
);

router.get("/reset/:resetToken", getResetPasswordPermission);

router.post(
  "/newpw",
  [
    body("password")
      .isStrongPassword({ minLength: 8, minLowercase: 1, minSymbols: 0 })
      .withMessage(
        "Password must have at least 8 characters with one uppercase letter and 1 symbol"
      ),
  ],
  postNewPassword
);

export default router;

