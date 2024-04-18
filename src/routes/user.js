import { Router } from "express";
import { getData, register, login } from "../controllers/auth.js";
import {
  emailVerification,
  resendVerificationEmail,
} from "../controllers/emailVerification.js";
import { validateUserMiddleware } from "../helper/validators/user.validator.js";
import {
  passwordResetEmail,
  resetPassword,
} from "../controllers/passwordReset.js";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
  getAllProfile,
  uploadProfileImage,
} from "../controllers/profile.js";
import { upload } from "../helper/multer/multer.js";
const router = Router();

router.route("/data").get(getData);
router.route("/register").post(validateUserMiddleware, register);
router.route("/login").post(login);
router.route("/email-verification").put(emailVerification);
router.route("/resend-email-verification").post(resendVerificationEmail);
router.route("/password-reset-email").post(passwordResetEmail);
router.route("/password-reset").put(resetPassword);
router.route("/profile").get(verifyToken, getProfile);
router.route("/profile-update").patch(verifyToken, updateProfile);
router.route("/all-profile").get(verifyTokenAndAdmin, getAllProfile);
router
  .route("/image-upload")
  .patch(verifyToken, upload.single("image"), uploadProfileImage);

export default router;
