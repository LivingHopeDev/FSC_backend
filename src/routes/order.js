import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrder,
} from "../controllers/order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAgent,
  verifyTokenAndManager,
  verifyTokenAndOwner,
} from "../middlewares/auth.js";

const router = Router();

router.route("/").get(verifyToken, getUserOrder).post(verifyToken, createOrder);
router.route("/all").get(verifyTokenAndAdmin, getAllOrders);

export default router;
