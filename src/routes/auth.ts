import { UserService } from "../services/UserService";
import { AuthController } from "../controllers/AuthController";
import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from '../config/data-source'
import { User } from "../entity/User";
import { logger } from '../config/logger';
import registerValidator from '../validators/register-validator';
const router = Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const authController = new AuthController(userService, logger)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next))


export default router