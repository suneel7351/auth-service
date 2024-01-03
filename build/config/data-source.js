"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const index_1 = require("../config/index");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: index_1.CONFIG.DB_HOST,
    port: Number(index_1.CONFIG.DB_PORT),
    username: index_1.CONFIG.DB_USERNAME,
    password: index_1.CONFIG.DB_PASSWORD,
    database: index_1.CONFIG.DB_NAME,
    // Set Always False
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.{ts,js}"],
    migrations: ["src/migration/*.{ts,js}"],
    subscribers: [],
});
