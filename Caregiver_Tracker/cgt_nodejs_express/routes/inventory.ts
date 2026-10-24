import { Router } from "express";
const router = Router();
import {
  addToInventory,
  getInventories,
  getAvailableInventory,
} from "../controllers/inventoryController.js";
import { isAuthenticated } from "../utils.js";

router.post("/add-to-inventory", isAuthenticated, addToInventory);
router.get("/get-inventories", isAuthenticated, getInventories);
router.get("/get-available-inventory", isAuthenticated, getAvailableInventory);

export default router;
