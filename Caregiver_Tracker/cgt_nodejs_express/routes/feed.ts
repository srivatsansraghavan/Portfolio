import { Router } from "express";
const router = Router();
import {
  saveTrackingFeed,
  getFeedDetails,
  deleteTrackedFeed,
  getFeedForId,
  saveEditedFeed,
} from "../controllers/feedController.js";
import { isAuthenticated } from "../utils.js";

router.post("/save-tracking-feed", isAuthenticated, saveTrackingFeed);
router.get("/get-feed-details", isAuthenticated, getFeedDetails);
router.delete("/delete-feed/:feedId", isAuthenticated, deleteTrackedFeed);
router.get("/get-feed-for-id/:feedId", isAuthenticated, getFeedForId);
router.post("/save-edited-feed", isAuthenticated, saveEditedFeed);

export default router;
