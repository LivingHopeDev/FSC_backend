import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import issueRoute from "./routes/issue.js";
import locationRoute from "./routes/mappedLocation.js";
export const all_Routes_function = (app) => {
  app.use("/user", userRoute);
  app.use("/product", productRoute);
  app.use("/issue", issueRoute);
  app.use("/location", locationRoute);
};
