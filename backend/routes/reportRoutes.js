import express from "express";
import {
  getDailyStockReport,
  getDashboardStats,
} from "../controllers/reportController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/daily-stock", authenticate, getDailyStockReport);
router.get("/dashboard-stats", authenticate, getDashboardStats);

export default router;
