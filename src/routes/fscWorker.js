import { Router } from "express";
import { getAllManager, getAllAgent } from "../controllers/fscWorker.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.route("/managers").get(verifyToken, getAllManager);
router.route("/agents").get(verifyToken, getAllAgent);

export default router;
