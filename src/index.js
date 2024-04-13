import userRoute from "./routes/user.js";

export const all_Routes_function = (app) => {
  app.use("/user", userRoute);
};
