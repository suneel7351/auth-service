/* eslint-disable @typescript-eslint/no-misused-promises */
import TenantService from '../services/TenantService'
import Tenant from '../controllers/TenantController'
import { NextFunction, Request, Response, Router } from 'express'
import { AppDataSource } from '../config/data-source'
import { Tenant as TenantTable } from '../entity/Tenant'

import { logger } from '../config/logger'
import authenticate from '../middleware/authenticate'
import { CreateTenant } from '../types'
import { canAccess } from '../middleware/canAccess'
import { Roles } from '../constants'
import tenantValidator from '../validators/tenant-validator'

const router = Router()
const tenantRepository = AppDataSource.getRepository(TenantTable)
const tenantService = new TenantService(tenantRepository)
const tenantObject = new Tenant(tenantService, logger)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate, canAccess([Roles.ADMIN]), tenantValidator, (req: Request, res: Response, next: NextFunction) => tenantObject.create(req as CreateTenant, res, next))
router.get("/", authenticate, (req: Request, res: Response, next: NextFunction) => tenantObject.tenantList(req, res, next))
router.get("/:id", authenticate, (req: Request, res: Response, next: NextFunction) => tenantObject.getSingleTenant(req, res, next))
router.patch("/:id", authenticate, canAccess([Roles.ADMIN]), tenantValidator, (req: Request, res: Response, next: NextFunction) => tenantObject.udpateTenant(req, res, next))
router.delete("/:id", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) => tenantObject.deleteTenant(req, res, next))
export default router