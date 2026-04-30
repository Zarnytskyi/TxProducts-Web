import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { register, login, logout, me } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;