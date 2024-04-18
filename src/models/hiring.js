import mongoose, { mongo } from "mongoose";
const hiredManagerSchema = new mongoose.Schema({
  manager: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  fsc_center: {
    type: String,
  },
});
