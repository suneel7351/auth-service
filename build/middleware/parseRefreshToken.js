"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../config/index");
const express_jwt_1 = require("express-jwt");
exports.default = (0, express_jwt_1.expressjwt)({
    secret: index_1.CONFIG.REFRESH_TOKEN_SECRET,
    algorithms: ['HS256'],
    getToken(req) {
        const { refreshToken } = req.cookies;
        return refreshToken;
    },
});
