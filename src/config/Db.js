import mongoose from "mongoose";

export const dbConnection = (dbUrl) => {
  mongoose
    .connect(dbUrl)
    .then(console.log("Db connected"))
    .catch((error) => {
      console.log("Db connection failed", error);
    });
};
