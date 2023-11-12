import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import request from 'supertest'
import createJWKMock from 'mock-jwks'
import app from "../../src/app"
import { User } from "../../src/entity/User"
import { Roles } from "../../src/constants/index"
describe("GET /auth/self", () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKMock>
    beforeAll(async () => {
        jwks = createJWKMock("http://localhost:6999")
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database Truncate
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()

    })

    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })



    describe("Given All Fields", () => {
        it("should return the 200 status code", async () => {
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER
            })
            const response = await request(app).get("/auth/self").
                set('Cookie', [`accessToken=${accessToken}`])
                .send()
            expect(response.statusCode).toBe(200)
        })

        it("should return the user data", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }

            const repo = connection.getRepository(User)
            const data = await repo.save({ ...userData, role: Roles.CUSTOMER })
            const accessToken = jwks.token({ sub: String(data.id), role: data.role })
            const res = await request(app).get("/auth/self").set("Cookie", [`accessToken=${accessToken}`]).send()

            expect((res.body as Record<string, string>).id).toBe(data.id)




        })


        it("should not return the password", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }

            const repo = connection.getRepository(User)
            const data = await repo.save({ ...userData, role: Roles.CUSTOMER })
            const accessToken = jwks.token({ sub: String(data.id), role: data.role })
            const res = await request(app).get("/auth/self").set("Cookie", [`accessToken=${accessToken};`]).send()

            expect((res.body as Record<string, string>)).not.toHaveProperty("password")




        })

        it("should  return 401 status code if token not found", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }

            const repo = connection.getRepository(User)
            await repo.save({ ...userData, role: Roles.CUSTOMER })
            const res = await request(app).get("/auth/self").send()
            expect(res.statusCode).toBe(401)






        })

    })


})