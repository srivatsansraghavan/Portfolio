import { Router } from "express";
const router = Router();
import { isAuthenticated } from "../utils.js";
import { deletePumped, getPumpedFeed, getPumpedForId, saveEditedPumped, savePumping } from "../controllers/pumpedController.js";

router.post("/save-pumping", isAuthenticated, savePumping);
router.get("/get-pumped", isAuthenticated, getPumpedFeed);
router.delete("/delete-pumped/:pumpedId", isAuthenticated, deletePumped);
router.get("/get-pumped-for-id/:pumpedId", isAuthenticated, getPumpedForId);
router.post("/save-edited-pumped", isAuthenticated, saveEditedPumped);

export default router;
