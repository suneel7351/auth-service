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
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../config/data-source");
const index_1 = require("../config/index");
const express_jwt_1 = require("express-jwt");
const RefreshToken_1 = require("../entity/RefreshToken");
const logger_1 = require("../config/logger");
exports.default = (0, express_jwt_1.expressjwt)({
    secret: index_1.CONFIG.REFRESH_TOKEN_SECRET,
    algorithms: ['HS256'],
    getToken(req) {
        const { refreshToken } = req.cookies;
        return refreshToken;
    },
    isRevoked(request, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = data_source_1.AppDataSource.getRepository(RefreshToken_1.RefreshToken);
                const refreshToken = yield repo.findOne({
                    where: {
                        id: Number((token === null || token === void 0 ? void 0 : token.payload).id),
                        user: {
                            id: Number(token === null || token === void 0 ? void 0 : token.payload.sub)
                        }
                    }
                });
                return refreshToken === null;
            }
            catch (error) {
                logger_1.logger.error("Error while getting the refresh token", { id: (token === null || token === void 0 ? void 0 : token.payload).id });
            }
            return true;
        });
    }
});
