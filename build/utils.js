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
exports.createTenant = exports.calculateDiscount = void 0;
const calculateDiscount = (price, percentage) => {
    return price * (percentage / 10);
};
exports.calculateDiscount = calculateDiscount;
const createTenant = (repo) => __awaiter(void 0, void 0, void 0, function* () {
    return yield repo.save({ name: "suneel", address: "kanpur" });
});
exports.createTenant = createTenant;
