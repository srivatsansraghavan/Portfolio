import { Router } from "express";
const router = Router();
import {
  addCareTaken,
  getCareTakenDetails,
  changeCareTaken,
} from "../controllers/caretakenController.js";
import { isAuthenticated } from "../utils.js";

router.post("/add-care-taken", isAuthenticated, addCareTaken);
router.get("/get-care-taken-details", isAuthenticated, getCareTakenDetails);
router.post("/change-care-taken", changeCareTaken);

export default router;
