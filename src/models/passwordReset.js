import mongoose from "mongoose";

const Schema = mongoose.Schema;

const passwordResetSchema = new Schema({
  userId: {
    type: String,
    ref: "User",
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
export default mongoose.model("PasswordReset", passwordResetSchema);
