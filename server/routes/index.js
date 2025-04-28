import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import pvRoute from "./pvRoute.js"; 
import uploadRoutes from "./uploadRoute.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/pv", pvRoute);
router.use("/upload", uploadRoutes);

export default router;
