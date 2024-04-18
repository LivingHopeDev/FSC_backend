import { Router } from "express";
import { createIssue, getAllIssue, deleteIssue } from "../controllers/issue.js";
import { upload } from "../helper/multer/multer.js";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/auth.js";

const router = Router();

router
  .route("/")
  .get(verifyTokenAndAdmin, getAllIssue)
  .post(verifyToken, upload.single("image"), createIssue);
router.route("/:id").delete(verifyTokenAndAdmin, deleteIssue);

export default router;
