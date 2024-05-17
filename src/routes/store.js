import { Router } from "express";
import { getFscStoresByFsc } from "../controllers/order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  getUserFSC,
  verifyManagerAndAdmin,
  verifyTokenAndManager,
} from "../middlewares/auth.js";

const router = Router();

router.route("/fsc-products").get(getUserFSC, getFscStoresByFsc);

export default router;
