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
const Tenant_1 = require("../../src/entity/Tenant");
const index_1 = require("../../src/constants/index");
describe("POST /tenants", () => {
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
        it("should return 201 status code", () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/tenants").set('Cookie', [`accessToken=${adminToken}`]).send(tenantsData);
            expect(res.statusCode).toBe(201);
        }));
        it("should create tenant in database", () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            };
            yield (0, supertest_1.default)(app_1.default).post("/tenants").set('Cookie', [`accessToken=${adminToken}`]).send(tenantsData);
            const tenantRepository = connection.getRepository(Tenant_1.Tenant);
            const tenants = yield tenantRepository.find();
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantsData.name);
            expect(tenants[0].address).toBe(tenantsData.address);
        }));
        it("should return 401 status code if user is not authenticate", () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/tenants").send(tenantsData);
            expect(res.statusCode).toBe(401);
            const tenantRepository = connection.getRepository(Tenant_1.Tenant);
            const tenants = yield tenantRepository.find();
            expect(tenants).toHaveLength(0);
        }));
        it("should return 403 status code if user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            };
            const managerToken = jwks.token({
                sub: '1',
                role: index_1.Roles.MANAGER
            });
            const res = yield (0, supertest_1.default)(app_1.default).post("/tenants")
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantsData);
            expect(res.statusCode).toBe(403);
            const tenantRepository = connection.getRepository(Tenant_1.Tenant);
            const tenants = yield tenantRepository.find();
            expect(tenants).toHaveLength(0);
        }));
    });
});
