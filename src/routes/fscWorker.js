import { Router } from "express";
import {
  getAllManager,
  getAllAgent,
  makeOrRevokeManagerOrAgent,
  getWorkersInaFSC,
} from "../controllers/fscWorker.js";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/auth.js";

const router = Router();

router.route("/managers").get(verifyToken, getAllManager);
router.route("/agents").get(verifyToken, getAllAgent);
router
  .route("/confirm-user-role/:id")
  .patch(verifyTokenAndAdmin, makeOrRevokeManagerOrAgent);
router.route("/fsc-agents").get(verifyToken, getWorkersInaFSC);

export default router;
