import express from "express";
import {
  createStockIn,
  getStockInRecords,
  getStockInById,
  updateStockIn,
  deleteStockIn,
} from "../controllers/stockInController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, createStockIn);
router.get("/", authenticate, getStockInRecords);
router.get("/:id", authenticate, getStockInById);
router.put("/:id", authenticate, updateStockIn);
router.delete("/:id", authenticate, deleteStockIn);

export default router;
