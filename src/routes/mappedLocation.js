import { Router } from "express";
import {
  createLocation,
  getAllLocation,
  deleteLocation,
  updateLocation,
} from "../controllers/mappedLocation.js";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/auth.js";
import { validateMappedLocation } from "../helper/validators/mappedLocation.js";

const router = Router();

router
  .route("/")
  .get(verifyToken, getAllLocation)
  .post(verifyTokenAndAdmin, validateMappedLocation, createLocation);
router
  .route("/:id")
  .patch(verifyTokenAndAdmin, validateMappedLocation, updateLocation)
  .delete(verifyTokenAndAdmin, deleteLocation);

export default router;
