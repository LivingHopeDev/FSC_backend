import mongoose, { mongo } from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
    },
    verification_id: {
      type: Number,
    },
    customer_id: {
      type: Number,
    },
    customer_code: {
      type: String,
    },

    reference: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("paymentVerification", verificationSchema);
