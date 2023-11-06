/* eslint-disable @typescript-eslint/no-misused-promises */
import { UserService } from "../services/UserService";
import { AuthController } from "../controllers/AuthController";
import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from '../config/data-source'
import { User } from "../entity/User";
import { logger } from '../config/logger';
import registerValidator from '../validators/register-validator';
import { TokenService } from "../services/Tokenservice";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login-validator";
import authenticate from "../middleware/authenticate";
import { AuthRequest } from "../types/index";
import validateRefresToken from "../middleware/validateRefresToken";
import parseRefreshToken from "../middleware/parseRefreshToken";
const router = Router()
const userRepository = AppDataSource.getRepository(User)
const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)
const userService = new UserService(userRepository)
const tokenService = new TokenService(refreshTokenRepo)
const authController = new AuthController(userService, logger, tokenService)


router.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next))

router.post("/login", loginValidator, (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next))


router.get("/self", authenticate, (req: Request, res: Response, next: NextFunction) => authController.self(req as AuthRequest, res, next))



router.post("/refresh", validateRefresToken, (req: Request, res: Response, next: NextFunction) => authController.refresh(req as AuthRequest, res, next))
router.post("/logout", authenticate, parseRefreshToken, (req: Request, res: Response, next: NextFunction) => authController.logout(req as AuthRequest, res, next))
export default router