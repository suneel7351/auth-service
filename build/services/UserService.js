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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser({ firstName, lastName, email, password, role, tenantId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield this.userRepository.findOne({ where: { email } });
            if (existUser !== null) {
                const error = (0, http_errors_1.default)(400, "Email is already registered!");
                throw error;
            }
            // Hash the password
            // 2^10 --> cpu intensive
            const saltRound = 10;
            const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
            try {
                return yield this.userRepository.save({ firstName, lastName, email, password: hashPassword, role, tenant: tenantId ? { id: Number(tenantId) } : undefined });
            }
            catch (error) {
                const err = (0, http_errors_1.default)(500, "Data failed to store in the database");
                throw err;
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({ where: { email }, select: ["id", "firstName", "lastName", "role", "password", "email"] });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({ where: { id } });
        });
    }
    matchPassword(userPassword, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(userPassword, passwordHash);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: {
                    id,
                },
            });
        });
    }
    update(userId, { firstName, lastName, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.update(userId, {
                    firstName,
                    lastName,
                    role,
                });
            }
            catch (err) {
                const error = (0, http_errors_1.default)(500, "Failed to update the user in the database");
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    deleteById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.delete(userId);
        });
    }
}
exports.UserService = UserService;
