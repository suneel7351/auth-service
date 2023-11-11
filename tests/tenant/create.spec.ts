import { AppDataSource } from "../../src/config/data-source"
import { DataSource } from "typeorm"
import request from 'supertest'
import app from "../../src/app"
import createJWKMock from 'mock-jwks'
import { Tenant } from "../../src/entity/Tenant"
import { Roles } from "../../src/constants/index"
describe("POST /tenants", () => {
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

        it("should return 201 status code", async () => {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            }
            const res = await request(app).post("/tenants").set('Cookie', [`accessToken=${adminToken}`]).send(tenantsData)

            expect(res.statusCode).toBe(201)

        })


        it("should create tenant in database", async () => {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            }
            await request(app).post("/tenants").set('Cookie', [`accessToken=${adminToken}`]).send(tenantsData)
            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants).toHaveLength(1)
            expect(tenants[0].name).toBe(tenantsData.name)
            expect(tenants[0].address).toBe(tenantsData.address)

        })

        it("should return 401 status code if user is not authenticate", async () => {
            const tenantsData = {
                name: "Suneel",
                address: "kanpur"
            }
            const res = await request(app).post("/tenants").send(tenantsData)
            expect(res.statusCode).toBe(401)
            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants).toHaveLength(0)

        })

    })



})