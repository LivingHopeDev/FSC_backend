import { hashPassword, comparePassword } from "../helper/auth.js";
import User from "../models/user.js";
import UserProfile from "../models/profile.js";
import { logger } from "../logger/logger.js";
import { sendVerificationEmail } from "../helper/password.emailVerification.js";
import jwt from "jsonwebtoken";
export const getData = async (req, res) => {
  let data = [
    { name: "tunde", id: 1 },
    { name: "emeka", id: 2 },
    { name: "kaka", id: 3 },
    { name: "peter", id: 4 },
  ];

  res.status(200).json(data);
};

export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is taken" });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    const newProfile = new UserProfile({
      user: newUser._id,
    });
    await newProfile.save();
    await newUser.save();
    sendVerificationEmail(newUser, res);
  } catch (error) {
    // logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Field must not be empty" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email not registered", data: existingUser });
    }
    await comparePassword(password, existingUser.password);
    if (existingUser.isVerified) {
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET,
        {}
      );

      const { password, ...others } = existingUser._doc;
      res.status(200).json({ ...others, token });
    } else {
      res.status(401).json({ message: "Verify email to login" });
    }
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
