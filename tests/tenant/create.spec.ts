import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import request from 'supertest'
import app from "../../src/app"
import { Tenant } from "../../src/entity/Tenant"
describe("POST /tenants", () => {
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

        it("should return 201 status code", async () => {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            }
            const res = await request(app).post("/tenants").send(tenantsData)
            expect(res.statusCode).toBe(201)

        })

        it("should create tenant in database", async () => {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            }
            await request(app).post("/tenants").send(tenantsData)
            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants).toHaveLength(1)
            expect(tenants[0].name).toBe(tenantsData.name)
            expect(tenants[0].address).toBe(tenantsData.address)

        })

    })



})