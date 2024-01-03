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
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
class User {
    constructor(userService, logger) {
        this.userService = userService;
        this.logger = logger;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (0, express_validator_1.validationResult)(req);
                if (!result.isEmpty()) {
                    return res.status(400).json({ error: result.array() });
                }
                const { firstName, lastName, email, password, role, tenantId } = req.body;
                const user = yield this.userService.createUser({ firstName, lastName, email, password, role, tenantId: Number(tenantId) });
                res.status(201).json({ id: user.id });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            const { firstName, lastName, role } = req.body;
            const userId = req.params.id;
            if (isNaN(Number(userId))) {
                next((0, http_errors_1.default)(400, "Invalid url param."));
                return;
            }
            this.logger.debug("Request for updating a user", req.body);
            try {
                yield this.userService.update(Number(userId), {
                    firstName,
                    lastName,
                    role,
                });
                this.logger.info("User has been updated", { id: userId });
                res.json({ id: Number(userId) });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAll();
                this.logger.info("All users have been fetched");
                res.json(users);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            if (isNaN(Number(userId))) {
                next((0, http_errors_1.default)(400, "Invalid url param."));
                return;
            }
            try {
                const user = yield this.userService.findById(Number(userId));
                if (!user) {
                    next((0, http_errors_1.default)(400, "User does not exist."));
                    return;
                }
                this.logger.info("User has been fetched", { id: user.id });
                res.json(user);
            }
            catch (err) {
                next(err);
            }
        });
    }
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            if (isNaN(Number(userId))) {
                next((0, http_errors_1.default)(400, "Invalid url param."));
                return;
            }
            try {
                yield this.userService.deleteById(Number(userId));
                this.logger.info("User has been deleted", {
                    id: Number(userId),
                });
                res.json({ id: Number(userId) });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = User;
