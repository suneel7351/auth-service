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
const data_source_1 = require("../../src/config/data-source");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const mock_jwks_1 = __importDefault(require("mock-jwks"));
const User_1 = require("../../src/entity/User");
const index_1 = require("../../src/constants/index");
describe("POST /users", () => {
    let connection;
    let jwks;
    let adminToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jwks = (0, mock_jwks_1.default)("http://localhost:6999");
        connection = yield data_source_1.AppDataSource.initialize();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Database Truncate
        yield connection.dropDatabase();
        yield connection.synchronize();
        jwks.start();
        adminToken = jwks.token({
            sub: '1',
            role: index_1.Roles.ADMIN
        });
    }));
    afterEach(() => {
        jwks.stop();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    describe("Given All Fields", () => {
        it("should user persist in database", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password",
                tenantId: 1,
            };
            yield (0, supertest_1.default)(app_1.default).post("/users").set('Cookie', [`accessToken=${adminToken}`]).send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].email).toBe(userData.email);
        }));
        it("should create only manager user", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password",
                tenantId: 1,
            };
            yield (0, supertest_1.default)(app_1.default).post("/users").set('Cookie', [`accessToken=${adminToken}`]).send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(users[0].role).toBe(index_1.Roles.MANAGER);
        }));
    });
});
