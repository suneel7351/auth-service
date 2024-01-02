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
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const data_source_1 = require("../../src/config/data-source");
const User_1 = require("../../src/entity/User");
const constants_1 = require("../../src/constants");
const index_1 = require("../utils/index");
// import { RefreshToken } from '../../src/entity/RefreshToken'
describe("POST /auth/register", () => {
    let connection;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield data_source_1.AppDataSource.initialize();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Database Truncate
        yield connection.dropDatabase();
        yield connection.synchronize();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.destroy();
    }));
    describe("Given All Fields", () => {
        it("should return the 201 status code", () => __awaiter(void 0, void 0, void 0, function* () {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            // ->2.Act
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // ->3.Assert
            expect(res.statusCode).toBe(201);
        }));
        it("should return valid json", () => __awaiter(void 0, void 0, void 0, function* () {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            // ->2.Act
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // ->3.Assert
            expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
        }));
        it("should persist the user in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            // ->2.Act
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // ->3.Assert
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        }));
        // it.todo("should return created user id", async () => {
        //     // Arrange
        //     const userData = {
        //         firstName: "Suneel",
        //         lastName: "Rajput",
        //         email: "rsuneel47@gmail.com",
        //         password: "password"
        //     };
        //     // Act
        //     const res = await request(app).post("/auth/register").send(userData);
        //     // Assert
        //     expect(res.statusCode).toBe(201);
        //     expect(res.body).toHaveProperty('id');
        // });
        it("should assign a customer role", () => __awaiter(void 0, void 0, void 0, function* () {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            // ->2.Act
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // ->3.Assert
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(constants_1.Roles.CUSTOMER);
        }));
        it("should store the hashed password in database", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            // ->2.Act
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Assert
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find({ select: ["password"] });
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        }));
        // it("should return status code 400 if email already registered", async () => {
        //     const userData = {
        //         firstName: "Suneel",
        //         lastName: "Rajput",
        //         email: "sunraz1666@gmail.com",
        //         password: "password"
        //     }
        //     const userRepository = connection.getRepository(User)
        //     await userRepository.save({ ...userData, role: "customer" })
        //     // ->2.Act
        //     const res = await request(app).post("/auth/register").send(userData)
        //     // Assert
        //     const users = await userRepository.find()
        //     expect(res.statusCode).toBe(400)
        //     expect(users).toHaveLength(1)
        // })
        it("should return refresh token and access token", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            let accessToken = null;
            let refreshToken = null;
            // ->2.Act
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Assert
            const cookies = res.headers['set-cookie'] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split('=')[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split('=')[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
            expect((0, index_1.isJWT)(accessToken)).toBeTruthy();
            expect((0, index_1.isJWT)(refreshToken)).toBeTruthy();
        }));
        it("should store the refresh token in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel7979@gmail.com",
                password: "password"
            };
            // ->2.Act
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            // Assert
            // const refreshTokenRepo = connection.getRepository(RefreshToken)
            // const tokens = await refreshTokenRepo.createQueryBuilder("refreshToken").where('refreshToken.userId = :userId', { userId: (res.body as Record<string, string>).id }).getMany()
            // expect(tokens).toHaveLength(1)
        }));
    });
    describe("Fields are missing", () => {
        it("should return 400 if email field is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "",
                password: "password"
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        }));
        it("should return 400 if firstname field is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        }));
        it("should return 400 if password field is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "",
                email: "rsuneel47@gmail.com",
                password: ""
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        }));
    });
    describe("input fields are not in correct format", () => {
        it("should trim email", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: " rsuneel47@gmail.com         ",
                password: "password"
            };
            yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            const user = users[0];
            expect(user.email).toBe("rsuneel47@gmail.com");
        }));
        it("should return 400 if email is not a valid email", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: " rsuneel47gmail",
                password: "password"
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            expect(res.statusCode).toBe(400);
        }));
        it("should return 400 if password length is less than 6 character", () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail",
                password: "pasrd"
            };
            const res = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User_1.User);
            const users = yield userRepository.find();
            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        }));
    });
});
