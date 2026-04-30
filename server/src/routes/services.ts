import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authenticate, requireAdmin, createService);
router.put("/:id", authenticate, requireAdmin, updateService);
router.delete("/:id", authenticate, requireAdmin, deleteService);

export default router;