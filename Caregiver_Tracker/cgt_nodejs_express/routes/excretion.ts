import { Router } from "express";
const router = Router();
import {
  saveTrackedExcretion,
  getExcretionDetails,
  deleteExcretion,
  getExcretionForId,
} from "../controllers/excretionController.js";
import { isAuthenticated } from "../utils.js";

router.post("/save-tracked-excretion", isAuthenticated, saveTrackedExcretion);
router.get("/get-excretion-details", isAuthenticated, getExcretionDetails);
router.delete("/delete-exc/:excId", isAuthenticated, deleteExcretion);
router.get("/get-exc-for-id/:excId", isAuthenticated, getExcretionForId);

export default router;
