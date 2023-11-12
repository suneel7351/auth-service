import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import request from 'supertest'
import app from "../../src/app"
import createJWKMock from 'mock-jwks'
import { User } from "../../src/entity/User"
import { Roles } from "../../src/constants/index"
describe("POST /users", () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKMock>
    let adminToken: string
    beforeAll(async () => {
        jwks = createJWKMock("http://localhost:6999")

        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database Truncate

        await connection.dropDatabase()
        await connection.synchronize()
        jwks.start()
        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN
        })

    })
    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })



    describe("Given All Fields", () => {




        it("should user persist in database", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password",
                tenantId: 1,
            }
            await request(app).post("/users").set('Cookie', [`accessToken=${adminToken}`]).send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(1)

            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].email).toBe(userData.email)

        })

        it("should create only manager user", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password",
                tenantId: 1,
            }
            await request(app).post("/users").set('Cookie', [`accessToken=${adminToken}`]).send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users[0].role).toBe(Roles.MANAGER)

        })


    })



})