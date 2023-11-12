import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import request from 'supertest'
import app from "../../src/app"
describe("POST /auth/login", () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database Truncate

        await connection.dropDatabase()
        await connection.synchronize()


    })

    afterAll(async () => {
        await connection.destroy()
    })



    describe("Given All Fields", () => {

        it('should check user exist or not', async () => {
            const data = {
                email: "rsuneel47@gmail.com",
                password: "password"
            }
            const res = await request(app).post("/auth/login").send(data)



            expect(res.status).toBe(200)
        })

    })


    // describe("Fields are missing", () => {






    // })
})