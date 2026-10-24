import { Router } from "express";
const router = Router();
import {
  saveTrackedMedications,
  getMedicationDetails,
  deleteMedication,
  getMedForId,
  getMedForm,
} from "../controllers/medicationController.js";
import { isAuthenticated } from "../utils.js";

router.post("/save-tracked-medication", isAuthenticated, saveTrackedMedications);
router.get("/get-medication-details", isAuthenticated, getMedicationDetails);
router.delete("/delete-med/:medId", isAuthenticated, deleteMedication);
router.get("/get-med-for-id/:medId", isAuthenticated, getMedForId);
router.get("/get-med-form/:medId", isAuthenticated, getMedForm);

export default router;
