import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'

import { User } from '../../src/entity/User'
import { truncateTable } from '../utils'

describe("POST /auth/register", () => {

    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })


    beforeEach(async () => {
        // Database Truncate

        await truncateTable(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe("Given All Fields", () => {
        it("should return the 201 status code", async () => {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }
            // ->2.Act

            const res = await request(app).post("/auth/register").send(userData)
            // ->3.Assert

            expect(res.statusCode).toBe(201)
        })



        it("should return valid json", async () => {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }
            // ->2.Act

            const res = await request(app).post("/auth/register").send(userData)
            // ->3.Assert

            expect(
                (res.headers as Record<string, string>)['content-type']
            ).toEqual(expect.stringContaining('json'))
        })




        it("should persist the user in the database", async () => {
            // AAA
            // ->1.Arrange(input data)
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }
            // ->2.Act

            await request(app).post("/auth/register").send(userData)
            // ->3.Assert

            const userRepository = connection.getRepository(User)

            const users = await userRepository.find()



            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)

        })
    })


    // describe("Fields are missing", () => {

    // })

})