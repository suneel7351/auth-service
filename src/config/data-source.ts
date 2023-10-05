import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import { CONFIG } from '../config/index'
export const AppDataSource = new DataSource({
    type: "postgres",
    host: CONFIG.DB_HOST,
    port: Number(CONFIG.DB_PORT),
    username: CONFIG.DB_USERNAME,
    password: CONFIG.DB_PASSWORD,
    database: CONFIG.DB_NAME,
    // Don't run this in the production
    synchronize: CONFIG.ENVIRONMENT === 'test' || CONFIG.ENVIRONMENT === 'dev',
    // synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
