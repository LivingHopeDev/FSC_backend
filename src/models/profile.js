import mongoose, { Schema } from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    gender: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    profile_image: {
      type: String,
      default: "https://iau.edu.lc/wp-content/uploads/2016/09/dummy-image.jpg",
    },
    wallet: {
      type: mongoose.Types.Decimal128,
      default: 0,
    },
    phone_number: {
      type: String,
    },
    company_name: {
      type: String,
    },
    job_role: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
