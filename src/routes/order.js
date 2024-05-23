import { Router } from "express";
import {
  cancelOrder,
  changeOrderStatus,
  createOrder,
  getAllOrders,
  getFscStoresByFsc,
  getUserOrder,
} from "../controllers/order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  getUserFSC,
  verifyManagerAndAdmin,
  verifyTokenAndManager,
} from "../middlewares/auth.js";

const router = Router();

router.route("/").get(getUserFSC, getUserOrder).post(getUserFSC, createOrder);
router.route("/:id/status").patch(getUserFSC, changeOrderStatus);
router.route("/fsc-stored-products").patch(getUserFSC, getFscStoresByFsc);
router.route("/:id/cancel").post(getUserFSC, cancelOrder);

router.route("/all").get(verifyTokenAndAdmin, getAllOrders);

export default router;
