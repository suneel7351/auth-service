"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
// import { CONFIG } from '@/config';
const app_1 = __importDefault(require("./app"));
// import { logger } from '@/config/logger';
const logger_1 = require("./config/logger");
const data_source_1 = require("./config/data-source");
const PORT = config_1.CONFIG.PORT || 1666;
const startServer = (port) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        logger_1.logger.info("Database connect successfully.");
        app_1.default.listen(port, () => {
            logger_1.logger.info(`Server is running on ${port}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.logger.error(error);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
});
void startServer(PORT);
