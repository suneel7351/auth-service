
import { Repository } from 'typeorm';
import { ITenant } from '../types/index'
import { Tenant } from '../entity/Tenant';
export default class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {

    }
    async create(tenant: ITenant) {
        return await this.tenantRepository.save(tenant)
    }
}