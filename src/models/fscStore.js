import mongoose from "mongoose";

const fscStoreSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    fsc: {
      type: mongoose.Types.ObjectId,
      ref: "FscCenter",
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FscStore", fscStoreSchema);
