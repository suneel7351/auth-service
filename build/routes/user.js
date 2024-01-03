"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../config/data-source");
const User_1 = require("../entity/User");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const canAccess_1 = require("../middleware/canAccess");
const constants_1 = require("../constants");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const UserService_1 = require("../services/UserService");
const create_user_validator_1 = __importDefault(require("../validators/create-user-validator"));
const update_user_validator_1 = __importDefault(require("../validators/update-user-validator"));
const logger_1 = require("../config/logger");
const router = (0, express_1.Router)();
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
const userService = new UserService_1.UserService(userRepo);
const userObject = new UserController_1.default(userService, logger_1.logger);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), create_user_validator_1.default, (req, res, next) => userObject.create(req, res, next));
router.patch("/:id", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), update_user_validator_1.default, (req, res, next) => userObject.update(req, res, next));
router.get("/:id", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), (req, res, next) => userObject.getOne(req, res, next));
router.get("/", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), (req, res, next) => userObject.getAll(req, res, next));
router.delete("/:id", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), (req, res, next) => userObject.destroy(req, res, next));
exports.default = router;
