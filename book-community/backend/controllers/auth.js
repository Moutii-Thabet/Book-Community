import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { throwError } from "../util/error.js";
import "dotenv/config";

import User from "../models/user.js";

import nodemailer from "nodemailer";

import mailgunTransport from "nodemailer-mailgun-transport";

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mailgunTransport(auth));

export async function postSignup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError("Invalid input(s)", 417, errors.array());
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPassword,
      books: [],
    });
    await user.save();
    res.status(201).json({ message: "Signed up successfully!" });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function postLogin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError("Invalid input(s)", 417, errors.array());
    }
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throwError("Wrong password.", 401);
    }

    const token = jwt.sign(
      { email, userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "logged in successfully!", token });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function postSendResetPassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError("Email does not exist.", 404, errors.array());
    }
    const email = req.body.email;
    const resetToken = await bcrypt.hash(email, 12);
    const expirationDate = Date.now() + 3600 * 1000;
    const user = await User.findOne({ email });
    user.resetToken = resetToken;
    user.expirationDate = expirationDate;

    await user.save();
    await transporter.sendMail({
      to: email,
      from: "books@test.com",
      subject: "Password Reset",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:5173/auth/reset/${encodeURIComponent(
          resetToken
        )}">link<a/> to set a new password.</p>
      `,
    });
    res
      .status(200)
      .json({ message: "an email to reset your password will be sent soon." });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function getResetPasswordPermission(req, res, next) {
  const resetToken = decodeURIComponent(req.params.resetToken);
  console.log(resetToken);
  const now = Date.now();
  try {
    const user = await User.findOne({
      resetToken,
      expirationDate: { $gt: now },
    });
    if (!user) {
      throwError("Unvalid/expired password reset token.", 401);
    }
    res.status(200).json({
      message: "Authorized to reset password.",
      resetToken,
      userId: user._id.toString(),
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}

export async function postNewPassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError("Invalid input", 417, errors.array());
    }

    const newPassword = req.body.password;
    const resetToken = req.body.token;
    const userId = req.body.userId;

    const user = await User.findOne({
      resetToken,
      expirationDate: { $gt: Date.now() },
      _id: userId,
    });
    if (!user) {
      throwError("Not authorized", 401);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.expirationDate = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
}
