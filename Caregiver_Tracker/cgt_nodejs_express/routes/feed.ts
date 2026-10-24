import { Router } from "express";
const router = Router();
import {
  saveTrackingFeed,
  savePumpingFeed,
  getFeedDetails,
  getPumpedFeed,
  deleteTrackedFeed,
  getFeedForId,
  saveEditedFeed,
} from "../controllers/feedController.js";
import { isAuthenticated } from "../utils.js";

router.post("/save-tracking-feed", isAuthenticated, saveTrackingFeed);
router.post("/save-pumping-feed", isAuthenticated, savePumpingFeed);
router.get("/get-feed-details", isAuthenticated, getFeedDetails);
router.get("/get-pumped-feeds", isAuthenticated, getPumpedFeed);
router.delete("/delete-feed/:feedId", isAuthenticated, deleteTrackedFeed);
router.get("/get-feed-for-id/:feedId", isAuthenticated, getFeedForId);
router.post("/save-edited-feed", isAuthenticated, saveEditedFeed);

export default router;
