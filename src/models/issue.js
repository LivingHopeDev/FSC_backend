import mongoose from "mongoose";
const { Schema } = mongoose;

const issueSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    issue: {
      type: String,
      require: true,
    },
    document: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
