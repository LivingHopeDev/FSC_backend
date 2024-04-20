import mongoose, { mongo } from "mongoose";
const fscCenterSchema = new mongoose.Schema({
  manager: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  fsc_name: {
    type: String,
  },
  fsc_location: {
    type: mongoose.Types.ObjectId,
    ref: "MappedLocation",
  },
});

export default mongoose.model("FscCenter", fscCenterSchema);
