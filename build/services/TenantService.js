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
class TenantService {
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    create(tenant) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tenantRepository.save(tenant);
        });
    }
    tenantList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tenantRepository.find({});
        });
    }
    getSingleTenant(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tenantRepository.findOne({ where: { id: id } });
        });
    }
    deleteTenant(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tenantRepository.delete(id);
        });
    }
    udpateTenant(id, tenant) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tenantRepository.update(id, tenant);
        });
    }
}
exports.default = TenantService;
