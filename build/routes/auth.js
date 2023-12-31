"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const UserService_1 = require("../services/UserService");
const AuthController_1 = require("../controllers/AuthController");
const express_1 = require("express");
const data_source_1 = require("../config/data-source");
const User_1 = require("../entity/User");
const logger_1 = require("../config/logger");
const register_validator_1 = __importDefault(require("../validators/register-validator"));
const Tokenservice_1 = require("../services/Tokenservice");
const RefreshToken_1 = require("../entity/RefreshToken");
const login_validator_1 = __importDefault(require("../validators/login-validator"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const validateRefresToken_1 = __importDefault(require("../middleware/validateRefresToken"));
const parseRefreshToken_1 = __importDefault(require("../middleware/parseRefreshToken"));
const router = (0, express_1.Router)();
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const refreshTokenRepo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
const userService = new UserService_1.UserService(userRepository);
const tokenService = new Tokenservice_1.TokenService(refreshTokenRepo);
const authController = new AuthController_1.AuthController(userService, logger_1.logger, tokenService);
router.post("/register", register_validator_1.default, (req, res) => authController.register(req, res));
router.post("/login", login_validator_1.default, (req, res, next) => authController.login(req, res, next));
router.get("/self", authenticate_1.default, (req, res, next) => authController.self(req, res, next));
router.post("/refresh", validateRefresToken_1.default, (req, res, next) => authController.refresh(req, res, next));
router.post("/logout", authenticate_1.default, parseRefreshToken_1.default, (req, res, next) => authController.logout(req, res, next));
exports.default = router;
