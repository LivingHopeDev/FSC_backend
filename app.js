import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./src/config/Db.js";
import { logger } from "./src/logger/logger.js";
import cors from "cors";
import { httpLogger } from "./src/logger/httpLogger.js";
import { all_Routes_function } from "./src/index.js";
const port = process.env.PORT || 3001;
const app = express();

let corsOptions = {
  origin: ["http://localhost:3000"],
};
app.use(httpLogger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
dbConnection(process.env.MONGO_URI);

all_Routes_function(app);

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message });
});
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
