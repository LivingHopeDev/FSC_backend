import { Router } from "express";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
} from "../controllers/product.js";
import { upload } from "../helper/multer/multer.js";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/auth.js";
import { validateProduct } from "../helper/validators/product.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    verifyTokenAndAdmin,
    upload.single("image"),
    validateProduct,
    createProduct
  );
router
  .route("/:id")
  .get(getProduct)
  .patch(
    verifyTokenAndAdmin,
    upload.single("image"),
    validateProduct,
    updateProduct
  )
  .delete(verifyTokenAndAdmin, deleteProduct);

export default router;
