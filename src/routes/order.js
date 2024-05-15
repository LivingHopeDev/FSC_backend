import { Router } from "express";
import {
  changeOrderStatus,
  createOrder,
  getAllOrders,
  getUserOrder,
} from "../controllers/order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  getUserFSC,
  verifyManagerAndAdmin,
} from "../middlewares/auth.js";

const router = Router();

router.route("/").get(getUserFSC, getUserOrder).post(getUserFSC, createOrder);
router.route("/:id/status").get(verifyManagerAndAdmin, changeOrderStatus);
router.route("/all").get(verifyTokenAndAdmin, getAllOrders);

export default router;
