import express from "express";
import {
  createStockOut,
  getStockOutRecords,
  getStockOutById,
  updateStockOut,
  deleteStockOut,
} from "../controllers/stockOutController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, createStockOut);
router.get("/", authenticate, getStockOutRecords);
router.get("/:id", authenticate, getStockOutById);
router.put("/:id", authenticate, updateStockOut);
router.delete("/:id", authenticate, deleteStockOut);

export default router;
