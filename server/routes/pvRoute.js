import express from "express";
import {
  createPV,
  getPVsByTask,
  getPVById,
  updatePV,
  completePV,
  deletePV
} from "../controllers/pvController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes pour les PVs
router.post("/task/:taskId", protectRoute, createPV);
router.get("/task/:taskId", protectRoute, getPVsByTask);
router.get("/:id", protectRoute, getPVById);
router.put("/:id", protectRoute, updatePV);
router.patch("/:id/complete", protectRoute, completePV);
router.delete('/:id', protectRoute, deletePV);

export default router;