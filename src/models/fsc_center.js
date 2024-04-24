import mongoose from "mongoose";

const fscCenterSchema = new mongoose.Schema(
  {
    manager: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    agent: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
    fsc_name: {
      type: String,
    },
    fsc_location: {
      type: mongoose.Types.ObjectId,
      ref: "MappedLocation",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FscCenter", fscCenterSchema);
