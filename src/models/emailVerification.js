import mongoose from "mongoose";

const Schema = mongoose.Schema;

const emailVerificationSchema = new Schema({
  userId: {
    type: String,
  },
  uniqueString: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  expireAt: {
    type: Date,
  },
});
export default mongoose.model("EmailVerification", emailVerificationSchema);
