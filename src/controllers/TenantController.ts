import { CreateTenant } from "../types/index";
import TenantService from "../services/TenantService";
import { NextFunction, Response } from "express";
import { Logger } from "winston";

export default class Tenant {
    constructor(private tenantService: TenantService, private logger: Logger) { }
    async create(req: CreateTenant, res: Response, next: NextFunction) {
        try {
            const { name, address } = req.body
            this.logger.debug("Request for creating tenant", req.body)
            const tenant = await this.tenantService.create({ name, address })
            this.logger.info("Tenant created", { id: tenant.id })
            res.status(201).json({ id: tenant.id })
        } catch (error) {
            next(error)
            return
        }
    }
}