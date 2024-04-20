import mongoose from "mongoose";

const mappedLocationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  states: [
    {
      state: {
        type: String,
        required: true,
      },
      addresses: [
        {
          address: {
            type: String,
            required: true,
          },
          local_government: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

export default mongoose.model("MappedLocation", mappedLocationSchema);
