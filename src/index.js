import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import issueRoute from "./routes/issue.js";
import locationRoute from "./routes/mappedLocation.js";
import fscRoute from "./routes/fsc.js";
import fscWorkerRoute from "./routes/fscWorker.js";
import farmerRoute from "./routes/farmer.js";
import orderRoute from "./routes/order.js";
import walletRoute from "./routes/wallet.js";
import storeRoute from "./routes/store.js";

export const all_Routes_function = (app) => {
  app.use("/user", userRoute);
  app.use("/product", productRoute);
  app.use("/issue", issueRoute);
  app.use("/location", locationRoute);
  app.use("/fsc", fscRoute);
  app.use("/fsc-worker", fscWorkerRoute);
  app.use("/farmer", farmerRoute);
  app.use("/order", orderRoute);
  app.use("/wallet", walletRoute);
  app.use("/store", storeRoute);
};
