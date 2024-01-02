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
const mock_jwks_1 = __importDefault(require("mock-jwks"));
const app_1 = __importDefault(require("../../src/app"));
const User_1 = require("../../src/entity/User");
const index_1 = require("../../src/constants/index");
describe("GET /auth/self", () => {
    let connection;
    let jwks;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        jwks = (0, mock_jwks_1.default)("http://localhost:6999");
        connection = yield data_source_1.AppDataSource.initialize();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Database Truncate
        jwks.start();
        yield connection.dropDatabase();
        yield connection.synchronize();
    }));
    afterEach(() => {
        jwks.stop();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    describe("Given All Fields", () => {
        it("should return the 200 status code", () => __awaiter(void 0, void 0, void 0, function* () {
            const accessToken = jwks.token({
                sub: '1',
                role: index_1.Roles.CUSTOMER
            });
            const response = yield (0, supertest_1.default)(app_1.default).get("/auth/self").
                set('Cookie', [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        }));
        it("should return the user data", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            const repo = connection.getRepository(User_1.User);
            const data = yield repo.save(Object.assign(Object.assign({}, userData), { role: index_1.Roles.CUSTOMER }));
            const accessToken = jwks.token({ sub: String(data.id), role: data.role });
            const res = yield (0, supertest_1.default)(app_1.default).get("/auth/self").set("Cookie", [`accessToken=${accessToken}`]).send();
            expect(res.body.id).toBe(data.id);
        }));
        it("should not return the password", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            const repo = connection.getRepository(User_1.User);
            const data = yield repo.save(Object.assign(Object.assign({}, userData), { role: index_1.Roles.CUSTOMER }));
            const accessToken = jwks.token({ sub: String(data.id), role: data.role });
            const res = yield (0, supertest_1.default)(app_1.default).get("/auth/self").set("Cookie", [`accessToken=${accessToken};`]).send();
            expect(res.body).not.toHaveProperty("password");
        }));
        it("should  return 401 status code if token not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            const repo = connection.getRepository(User_1.User);
            yield repo.save(Object.assign(Object.assign({}, userData), { role: index_1.Roles.CUSTOMER }));
            const res = yield (0, supertest_1.default)(app_1.default).get("/auth/self").send();
            expect(res.statusCode).toBe(401);
        }));
    });
});
