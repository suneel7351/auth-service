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
const http_errors_1 = __importDefault(require("http-errors"));
const express_validator_1 = require("express-validator");
class Tenant {
    constructor(tenantService, logger) {
        this.tenantService = tenantService;
        this.logger = logger;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, address } = req.body;
                this.logger.debug("Request for creating tenant", req.body);
                const tenant = yield this.tenantService.create({ name, address });
                this.logger.info("Tenant created", { id: tenant.id });
                res.status(201).json({ id: tenant.id });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    tenantList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tenants = yield this.tenantService.tenantList();
                this.logger.info("Tenant list", tenants);
                res.status(200).json({ tenants });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    getSingleTenant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (isNaN(Number(id))) {
                    return next((0, http_errors_1.default)(400, "Invalid url param"));
                }
                const tenant = yield this.tenantService.getSingleTenant(Number(id));
                if (!tenant)
                    return next((0, http_errors_1.default)(400, "Tenant not found."));
                this.logger.info("Tenant ", tenant);
                res.status(200).json({ tenant });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    deleteTenant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (isNaN(Number(id))) {
                    return next((0, http_errors_1.default)(400, "Invalid url param"));
                }
                yield this.tenantService.deleteTenant(Number(id));
                this.logger.info("Tenant has been deleted", {
                    id: Number(id),
                });
                res.status(200).json({ id: Number(id) });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    udpateTenant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (0, express_validator_1.validationResult)(req);
                if (!result.isEmpty()) {
                    return res.status(400).json({ error: result.array() });
                }
                const { id } = req.params;
                const { name, address } = req.body;
                if (isNaN(Number(id))) {
                    return next((0, http_errors_1.default)(400, "Invalid url param"));
                }
                const tenant = yield this.tenantService.udpateTenant(Number(id), { name, address });
                this.logger.info("Tenant has been updated", {
                    id: Number(id),
                });
                res.status(200).json({ tenant });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
}
exports.default = Tenant;
