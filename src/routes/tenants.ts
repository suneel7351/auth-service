import TenantService from '..//services/TenantService'
import Tenant from '../controllers/TenantController'
import { NextFunction, Request, Response, Router } from 'express'
import { AppDataSource } from '../config/data-source'
import { Tenant as TenantTable } from '../entity/Tenant'

import { logger } from '../config/logger'

const router = Router()
const tenantRepository = AppDataSource.getRepository(TenantTable)
const tenantService = new TenantService(tenantRepository)
const tenantObject = new Tenant(tenantService, logger)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", (req: Request, res: Response, next: NextFunction) => tenantObject.create(req, res, next))


export default router