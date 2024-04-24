import mongoose from "mongoose";

const mappedLocationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    local_government: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MappedLocation", mappedLocationSchema);
