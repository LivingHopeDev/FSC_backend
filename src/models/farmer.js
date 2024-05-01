import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  manager: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  farmLocation: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Farmer", farmerSchema);
