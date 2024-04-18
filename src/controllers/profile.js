import Profile from "../models/profile.js";
import cloudinary from "../helper/cloudinary/cloudinary.js";
import { getImageId } from "../helper/getImageId.js";
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const existingUser = await Profile.findOne({ user: userId }).populate(
      "user",
      "-password"
    );
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "You need to be signed in", data: existingUser });
    }

    res.status(200).json({ data: existingUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { gender, country, state, phone_number, company_name } = req.body;
  try {
    const data = { gender, country, state, phone_number, company_name };
    const updatedUser = await Profile.findOneAndUpdate({ user: userId }, data, {
      new: true,
    });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "You need to be signed in", data: updatedUser });
    }
    res.status(200).json({ message: "Profile updated", data: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getAllProfile = async (req, res) => {
  try {
    const allUsers = await Profile.find().populate("user", "-password");
    if (!allUsers) {
      return res
        .status(404)
        .json({ message: "No registered users yet", data: allUsers });
    }

    res.status(200).json({ data: allUsers });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const uploadProfileImage = async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });
  try {
    if (profile.profile_image) {
      const imageId = getImageId(profile.profile_image);

      await cloudinary.uploader.destroy(`FSC/profile/${imageId}`);
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "FSC/profile",
    });
    const data = { profile_image: upload.secure_url };

    const updatedUser = await Profile.findByIdAndUpdate(profile._id, data, {
      new: true,
    });

    res.status(200).json({ message: "Image uploaded", data: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
