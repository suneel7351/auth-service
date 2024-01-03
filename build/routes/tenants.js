"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const TenantService_1 = __importDefault(require("../services/TenantService"));
const TenantController_1 = __importDefault(require("../controllers/TenantController"));
const express_1 = require("express");
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entity/Tenant");
const logger_1 = require("../config/logger");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const canAccess_1 = require("../middleware/canAccess");
const constants_1 = require("../constants");
const tenant_validator_1 = __importDefault(require("../validators/tenant-validator"));
const router = (0, express_1.Router)();
const tenantRepository = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
const tenantService = new TenantService_1.default(tenantRepository);
const tenantObject = new TenantController_1.default(tenantService, logger_1.logger);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), tenant_validator_1.default, (req, res, next) => tenantObject.create(req, res, next));
router.get("/", authenticate_1.default, (req, res, next) => tenantObject.tenantList(req, res, next));
router.get("/:id", authenticate_1.default, (req, res, next) => tenantObject.getSingleTenant(req, res, next));
router.patch("/:id", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), tenant_validator_1.default, (req, res, next) => tenantObject.udpateTenant(req, res, next));
router.delete("/:id", authenticate_1.default, (0, canAccess_1.canAccess)([constants_1.Roles.ADMIN]), (req, res, next) => tenantObject.deleteTenant(req, res, next));
exports.default = router;
