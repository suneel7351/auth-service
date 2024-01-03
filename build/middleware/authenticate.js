"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../config/index");
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
exports.default = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        jwksUri: index_1.CONFIG.JWKS_URI,
        cache: true,
        rateLimit: true
    }),
    algorithms: ['RS256'],
    getToken(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.split(" ")[1] !== 'undefined') {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }
        const { accessToken } = req.cookies;
        return accessToken;
    },
});
