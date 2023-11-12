
import { Repository } from 'typeorm';
import { ITenant } from '../types/index'
import { Tenant } from '../entity/Tenant';
export default class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {

    }
    async create(tenant: ITenant) {
        return await this.tenantRepository.save(tenant)
    }
    async tenantList() {
        return await this.tenantRepository.find({})
    }
    async getSingleTenant(id: number) {
        return await this.tenantRepository.findOne({ where: { id: id } })
    }

    async deleteTenant(id: number) {
        return await this.tenantRepository.delete(id)
    }
    async udpateTenant(id: number, tenant: ITenant) {
        return await this.tenantRepository.update(id, tenant)
    }
}