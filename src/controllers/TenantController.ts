import { CreateTenant } from "../types/index";
import TenantService from "../services/TenantService";
import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

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


    async tenantList(req: Request, res: Response, next: NextFunction) {
        try {


            const tenants = await this.tenantService.tenantList()
            this.logger.info("Tenant list", tenants)
            res.status(200).json({ tenants })
        } catch (error) {
            next(error)
            return
        }
    }

    async getSingleTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            if (isNaN(Number(id))) {
                return next(createHttpError(400, "Invalid url param"))
            }
            const tenant = await this.tenantService.getSingleTenant(Number(id))
            if (!tenant) return next(createHttpError(400, "Tenant not found."))
            this.logger.info("Tenant ", tenant)
            res.status(200).json({ tenant })
        } catch (error) {
            next(error)
            return
        }
    }

    async deleteTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            if (isNaN(Number(id))) {
                return next(createHttpError(400, "Invalid url param"))
            }
            await this.tenantService.deleteTenant(Number(id))
            this.logger.info("Tenant has been deleted", {
                id: Number(id),
            });
            res.status(200).json({ id: Number(id) })
        } catch (error) {
            next(error)
            return
        }
    }

    async udpateTenant(req: CreateTenant, res: Response, next: NextFunction) {
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) {

                return res.status(400).json({ error: result.array() })
            }
            const { id } = req.params
            const { name, address } = req.body
            if (isNaN(Number(id))) {
                return next(createHttpError(400, "Invalid url param"))
            }
            const tenant = await this.tenantService.udpateTenant(Number(id), { name, address })
            this.logger.info("Tenant has been updated", {
                id: Number(id),
            });
            res.status(200).json({ tenant })
        } catch (error) {
            next(error)
            return
        }
    }
}