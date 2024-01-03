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
exports.TokenService = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = require("../config/index");
class TokenService {
    constructor(refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    generateAccessToken(payload) {
        let privateKey;
        if (!index_1.CONFIG.PRIVATE_KEY) {
            const err = (0, http_errors_1.default)(500, "Secret_key not set...");
            throw err;
        }
        try {
            privateKey = index_1.CONFIG.PRIVATE_KEY;
        }
        catch (error) {
            const err = (0, http_errors_1.default)(500, "Error while reading private key...");
            throw err;
        }
        const accessToken = (0, jsonwebtoken_1.sign)(payload, privateKey, {
            algorithm: "RS256", expiresIn: "1h", issuer: "auth-service"
        });
        return accessToken;
    }
    generateRefreshToken(payload) {
        const refreshToken = (0, jsonwebtoken_1.sign)(payload, index_1.CONFIG.REFRESH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "15d",
            issuer: "auth-service",
            jwtid: String(payload.id)
        });
        return refreshToken;
    }
    persistRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const newRefreshToken = yield this.refreshTokenRepository.save({
                user: user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR)
            });
            return newRefreshToken;
        });
    }
    deleteRefreshToken(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.refreshTokenRepository.delete({ id: tokenId });
        });
    }
}
exports.TokenService = TokenService;
