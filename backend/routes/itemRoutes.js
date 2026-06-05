import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  initializeItems,
} from "../controllers/itemController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Initialize predefined items (public endpoint for first-time setup)
router.post("/initialize", initializeItems);

router.get("/", authenticate, getAllItems);
router.get("/:id", authenticate, getItemById);
router.post("/", authenticate, createItem);
router.put("/:id", authenticate, updateItem);
router.delete("/:id", authenticate, deleteItem);

export default router;
