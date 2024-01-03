"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccess = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const canAccess = (roles) => {
    return (req, res, next) => {
        const _req = req;
        const role = _req.auth.role;
        if (!roles.includes(role)) {
            const err = (0, http_errors_1.default)(403, "You don't have enough permissions");
            next(err);
            return;
        }
        next();
    };
};
exports.canAccess = canAccess;
