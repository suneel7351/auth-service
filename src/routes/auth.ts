import { AuthController } from "../controllers/AuthController";
import { Router } from "express";

const router = Router()
const authController = new AuthController()

router.post("/register", (req, res) => authController.register(req, res))
export default router