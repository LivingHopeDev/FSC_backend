import { Router } from "express";
import {
  deposit,
  transferMoneyToFscWallet,
  verifyDeposit,
} from "../controllers/wallet.js";
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
router.route("/send").post(verifyToken, transferMoneyToFscWallet);

export default router;
