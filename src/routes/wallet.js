import { Router } from "express";
import { deposit, verifyDeposit } from "../controllers/wallet.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAgent,
  verifyTokenAndManager,
  verifyTokenAndOwner,
} from "../middlewares/auth.js";

const router = Router();

router.route("/").post(verifyToken, deposit);
router.route("/verify-deposit").post(verifyToken, verifyDeposit);

export default router;
