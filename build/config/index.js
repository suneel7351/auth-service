"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`) });
const { PORT, LOG_LEVEL, ENVIRONMENT, REFRESH_TOKEN_SECRET, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, JWKS_URI, PRIVATE_KEY } = process.env;
exports.CONFIG = {
    PORT,
    LOG_LEVEL,
    ENVIRONMENT,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    REFRESH_TOKEN_SECRET,
    DB_NAME,
    JWKS_URI,
    PRIVATE_KEY
};
