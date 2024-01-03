"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
class AuthController {
    constructor(userService, logger, tokenService) {
        this.userService = userService;
        this.logger = logger;
        this.tokenService = tokenService;
        this.userService = userService;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ error: result.array() });
            }
            const { firstName, lastName, email, password } = req.body;
            this.logger.debug("Request for register user", { firstName, lastName, email, password: "****" });
            try {
                const user = yield this.userService.createUser({ firstName, lastName, email, password, role: constants_1.Roles.CUSTOMER });
                this.logger.info("User has been registered", { id: user.id });
                const payload = {
                    sub: String(user.id),
                    role: user.role
                };
                const accessToken = this.tokenService.generateAccessToken(payload);
                // CONFIG.REFRESH_TOKEN_SECRET! iska mtlb sure hain ki ye string hogi empty nhi hoga
                // persist the refresh token
                const newRefreshToken = yield this.tokenService.persistRefreshToken(user);
                const refreshToken = this.tokenService.generateRefreshToken(Object.assign(Object.assign({}, payload), { id: String(newRefreshToken.id) }));
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    domain: "localhost",
                    maxAge: 1000 * 60 * 60,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    domain: "localhost",
                    maxAge: 1000 * 60 * 60 * 24 * 15
                });
                res.status(201).json({ id: user.id });
            }
            catch (error) {
                // console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ error: result.array() });
            }
            const { email, password } = req.body;
            this.logger.debug("Request for Login user", { email, password: "****" });
            try {
                const user = yield this.userService.getUserByEmail(email);
                if (!user) {
                    const err = (0, http_errors_1.default)(400, "Invalid email or password.");
                    throw err;
                }
                const matchPassword = yield this.userService.matchPassword(password, user.password);
                if (!matchPassword) {
                    const err = (0, http_errors_1.default)(400, "Invalid email or password.");
                    return next(err);
                }
                const payload = {
                    sub: String(user.id),
                    role: user.role
                };
                const accessToken = this.tokenService.generateAccessToken(payload);
                // CONFIG.REFRESH_TOKEN_SECRET! iska mtlb sure hain ki ye string hogi empty nhi hoga
                // persist the refresh token
                const newRefreshToken = yield this.tokenService.persistRefreshToken(user);
                const refreshToken = this.tokenService.generateRefreshToken(Object.assign(Object.assign({}, payload), { id: String(newRefreshToken.id) }));
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    domain: "localhost",
                    maxAge: 1000 * 60 * 60,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    domain: "localhost",
                    maxAge: 1000 * 60 * 60 * 24 * 15
                });
                res.status(200).json({ id: user.id });
            }
            catch (error) {
                // console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    self(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getById(Number(req.auth.sub));
                if (!user) {
                    const err = (0, http_errors_1.default)(404, "User not found.");
                    return res.status(err.statusCode).json(err);
                }
                res.status(200).json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    sub: String(req.auth.sub),
                    role: String(req.auth.role)
                };
                const accessToken = this.tokenService.generateAccessToken(payload);
                // CONFIG.REFRESH_TOKEN_SECRET! iska mtlb sure hain ki ye string hogi empty nhi hoga
                // persist the refresh token
                const user = yield this.userService.getById(Number(req.auth.sub));
                if (!user) {
                    const err = (0, http_errors_1.default)(401, "User with the token could not find.");
                    return next(err);
                }
                const newRefreshToken = yield this.tokenService.persistRefreshToken(user);
                // Delete old refresh Token
                yield this.tokenService.deleteRefreshToken(Number(req.auth.id));
                const refreshToken = this.tokenService.generateRefreshToken(Object.assign(Object.assign({}, payload), { id: String(newRefreshToken.id) }));
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    domain: "localhost",
                    maxAge: 1000 * 60 * 60,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    domain: "localhost",
                    maxAge: 1000 * 60 * 60 * 24 * 15
                });
                res.status(200).json({ id: user.id });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.tokenService.deleteRefreshToken(Number(req.auth.id));
                this.logger.info("User has been logged out", { id: req.auth.sub });
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                res.json({});
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
