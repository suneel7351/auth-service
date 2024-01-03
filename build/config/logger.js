"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const _1 = require(".");
exports.logger = winston_1.default.createLogger({
    level: _1.CONFIG.LOG_LEVEL,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston_1.default.transports.Console({
            // format: winston.format.simple(),
            silent: _1.CONFIG.ENVIRONMENT === 'test' ||
                _1.CONFIG.ENVIRONMENT === 'production',
        }),
        new winston_1.default.transports.File({
            dirname: 'logs',
            filename: 'application.log',
            level: 'info',
            silent: _1.CONFIG.ENVIRONMENT === 'test',
        }),
    ],
});
