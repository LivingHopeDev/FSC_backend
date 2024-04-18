import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import issueRoute from "./routes/issue.js";
export const all_Routes_function = (app) => {
  app.use("/user", userRoute);
  app.use("/product", productRoute);
  app.use("/issue", issueRoute);
};
