import UserPasswordReset from "../models/passwordReset.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { sendPasswordResetEmail } from "../helper/emailServices/password.emailVerification.js";

export const passwordResetEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      // Check if the user has been verified before sending password reset email
      if (existingUser.isVerified) {
        sendPasswordResetEmail(existingUser, res);
      } else {
        res
          .status(401)
          .json({ message: "Email has not been verified", data: existingUser });
      }
    } else {
      res.status(404).json({ message: "Email not registered" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, uniqueString, newPassword } = req.body;
  console.log(userId, uniqueString, newPassword);
  try {
    const existingUser = await UserPasswordReset.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (existingUser) {
      const expireAt = existingUser.expireAt;

      const hashedUniqueString = existingUser.uniqueString;

      // checking if the uniqueString has expired
      if (expireAt < Date.now()) {
        UserPasswordReset.deleteOne({ userId })
          .then((result) => {
            res.status(200).json({
              error: true,
              message: "link expired, request for new link",
            });
          })
          .catch((err) => {
            res
              .status(500)
              .json("error occurred while deleting this user password reset");
          });
      } else {
        // if unique string hasn't expire
        // compare the unique string with the one in the database
        bcrypt
          .compare(uniqueString, hashedUniqueString)
          .then((result) => {
            if (result) {
              //  Hass the new password
              bcrypt
                .hash(newPassword, 12)
                .then((hashedPassword) => {
                  // Update password
                  User.updateOne(
                    { _id: userId },
                    { password: hashedPassword }
                  ).then(() => {
                    // delete reset data from db
                    UserPasswordReset.deleteOne({ userId })
                      .then((response) => {
                        res.json({ message: "password reset successfully" });
                      })
                      .catch((err) => {
                        res.json({ message: "deleting reset data failed" });
                      });
                  });
                })
                .then((result) => {})
                .catch((err) => {
                  res.json({ message: "password not updated" });
                })
                .catch((err) => {
                  res.json({ message: "Error while hashing password" });
                });
            } else {
              res.json({
                error: true,
                message: "Invalid password reset details",
              });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "unique string not valid" });
          });
      }
    } else
      res
        .status(404)
        .json({ message: "Invalid details: Use the link in your mail!" });
  } catch (err) {
    console.log(err);
    res.status(404).json("Invalid id");
  }
};
