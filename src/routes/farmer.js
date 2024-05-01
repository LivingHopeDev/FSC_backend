import { Router } from "express";
import {
  createfarmer,
  getAllFarmer,
  updateFarmer,
  getFarmersByManager,
  deleteFarmer,
} from "../controllers/farmer.js";
import { validateFarmer } from "../helper/validators/user.validator.js";
import {
  verifyToken,
  verifyTokenAndManager,
  verifyTokenAndAdmin,
  verifyManagerAndAdmin,
} from "../middlewares/auth.js";
import { upload } from "../helper/multer/multer.js";
import { uploadProfileImage } from "../controllers/profile.js";
const router = Router();

router
  .route("/")
  .get(verifyTokenAndManager, getFarmersByManager)
  .post(validateFarmer, verifyTokenAndManager, createfarmer);
router.route("/all").get(verifyTokenAndAdmin, getAllFarmer);
router
  .route("/:id")
  .patch(verifyManagerAndAdmin, updateFarmer)
  .delete(verifyTokenAndAdmin, deleteFarmer);
router
  .route("/image-upload")
  .patch(verifyToken, upload.single("image"), uploadProfileImage);

export default router;
