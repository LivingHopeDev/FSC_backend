import Email from "../models/emailVerification.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { sendVerificationEmail } from "../helper/password.emailVerification.js";

export const emailVerification = async (req, res) => {
  const { userId, uniqueString } = req.body;

  try {
    const existingUser = await Email.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (existingUser) {
      const expireAt = existingUser.expireAt;

      const hashedUniqueString = existingUser.uniqueString;

      // checking if the uniqueNumber has expired
      if (expireAt < Date.now()) {
        Email.deleteOne({ userId })
          .then((result) => {
            User.deleteOne({ _id: userId }).then(() => {
              res.status(200).json({ message: "link expired, signup again" });
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err.message,
              message: "error occurred while deleting this user",
            });
          });
      } else {
        bcrypt
          .compare(uniqueString, hashedUniqueString)
          .then((result) => {
            if (result) {
              User.updateOne({ _id: userId }, { isVerified: true })
                .then(() => {
                  Email.deleteOne({ userId })
                    .then(() => {
                      res.status(200).json({ message: "Email verified" });
                    })
                    .catch((err) => {
                      res
                        .status(500)
                        .json("email Verification data not deleted");
                    });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ error: err.message, message: "update error" });
                });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "Unique number not valid" });
          });
      }
    } else {
      res.json({
        error: true,
        message: "Email has been verified already!",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Verified or email not registered",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser === null) {
      res.status(404).json({ error: true, Message: "Email not registered" });
    } else {
      sendVerificationEmail(existingUser, res);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, Message: "Internal Server error" });
  }
};
