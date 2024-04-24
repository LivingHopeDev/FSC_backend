import { Router } from "express";
import {
  createFsc,
  getFSCByowner,
  getAllFSC,
  hireManager,
  hireAgent,
} from "../controllers/fscCenter.js";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAgent,
  verifyTokenAndManager,
  verifyTokenAndOwner,
} from "../middlewares/auth.js";

const router = Router();

router
  .route("/")
  .get(verifyTokenAndOwner, getFSCByowner)
  .post(verifyTokenAndOwner, createFsc);
router.route("/all").get(verifyTokenAndAdmin, getAllFSC);
router.route("/hire-manager/:id").patch(verifyTokenAndOwner, hireManager);
router.route("/hire-agent/:id").patch(verifyTokenAndManager, hireAgent);

export default router;
