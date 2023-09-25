import app from '../../src/app'
import request from 'supertest'

describe("POST /auth/register", () => {
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
    })


    // describe("Fields are missing", () => {

    // })

})