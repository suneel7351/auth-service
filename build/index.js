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
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./config/data-source");
const logger_1 = require("./config/logger");
const User_1 = require("./entity/User");
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.User();
    user.firstName = "Suneel";
    user.lastName = "Rajput";
    user.email = "rsuneel47@gmail.com";
    user.password = "password";
    yield data_source_1.AppDataSource.manager.save(user);
    yield data_source_1.AppDataSource.manager.find(User_1.User);
})).catch(error => { logger_1.logger.error(error); });
