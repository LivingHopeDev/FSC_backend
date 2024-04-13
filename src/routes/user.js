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
const router = Router();

router.route("/data").get(getData);
router.route("/register").post(validateUserMiddleware, register);
router.route("/login").post(login);
router.route("/email-verification").put(emailVerification);
router.route("/resend-email-verification").post(resendVerificationEmail);
router.route("/password-reset-email").post(passwordResetEmail);
router.route("/password-reset").post(resetPassword);

export default router;
