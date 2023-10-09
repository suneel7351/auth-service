import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'

import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'

describe("POST /auth/register", () => {

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




        it("should assign a customer role", async () => {
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



            expect(users[0]).toHaveProperty("role")
            expect(users[0].role).toBe(Roles.CUSTOMER)

        })


        it("should store the hashed password in database", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }
            // ->2.Act

            await request(app).post("/auth/register").send(userData)


            // Assert
            const userRepository = connection.getRepository(User)

            const users = await userRepository.find()

            expect(users[0].password).not.toBe(userData.password)
            expect(users[0].password).toHaveLength(60)
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
        })


        it("should return status code 400 if email already registered", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }

            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: "customer" })
            // ->2.Act

            const res = await request(app).post("/auth/register").send(userData)
            // Assert

            const users = await userRepository.find()
            expect(res.statusCode).toBe(400)

            expect(users).toHaveLength(1)
        })


    })


    describe("Fields are missing", () => {

        it("should return 400 if email field is missing", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "",
                password: "password"
            }

            const res = await request(app).post("/auth/register").send(userData)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(res.statusCode).toBe(400)
            expect(users).toHaveLength(0)


        })

        it("should return 400 if firstname field is missing", async () => {
            const userData = {
                firstName: "",
                lastName: "Rajput",
                email: "rsuneel47@gmail.com",
                password: "password"
            }

            const res = await request(app).post("/auth/register").send(userData)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(res.statusCode).toBe(400)
            expect(users).toHaveLength(0)


        })

        it("should return 400 if password field is missing", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "",
                email: "rsuneel47@gmail.com",
                password: ""
            }

            const res = await request(app).post("/auth/register").send(userData)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(res.statusCode).toBe(400)
            expect(users).toHaveLength(0)


        })





    })



    describe("input fields are not in correct format", () => {

        it("should trim email", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: " rsuneel47@gmail.com         ",
                password: "password"
            }

            await request(app).post("/auth/register").send(userData)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            const user = users[0]
            expect(user.email).toBe("rsuneel47@gmail.com")

        })


        it("should return 400 if email is not a valid email", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: " rsuneel47gmail",
                password: "password"
            }

            const res = await request(app).post("/auth/register").send(userData)

            expect(res.statusCode).toBe(400)

        })


        it("should return 400 if password length is less than 6 character", async () => {
            const userData = {
                firstName: "Suneel",
                lastName: "Rajput",
                email: "rsuneel47@gmail",
                password: "pasrd"
            }

            const res = await request(app).post("/auth/register").send(userData)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(res.statusCode).toBe(400)
            expect(users).toHaveLength(0)

        })




    })

})