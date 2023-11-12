/* eslint-disable @typescript-eslint/no-misused-promises */

import { NextFunction, Request, Response, Router } from 'express'
import { AppDataSource } from '../config/data-source'
import { User as UserTable } from '../entity/User'
import authenticate from '../middleware/authenticate'
import { canAccess } from '../middleware/canAccess'
import { Roles } from '../constants'
import User from '../controllers/UserController'
import { UserService } from '../services/UserService'
import createUserValidator from '../validators/create-user-validator'
import updateUserValidator from '../validators/update-user-validator'
import { logger } from '../config/logger'

const router = Router()
const userRepo = AppDataSource.getRepository(UserTable)
const userService = new UserService(userRepo)

const userObject = new User(userService, logger)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate, canAccess([Roles.ADMIN]), createUserValidator, (req: Request, res: Response, next: NextFunction) => userObject.create(req, res, next))
router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (req: Request, res: Response, next: NextFunction) => userObject.update(req, res, next)
);



router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) => userObject.getOne(req, res, next)
);

router.get("/", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) => userObject.getAll(req, res, next)
);

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) => userObject.destroy(req, res, next)
);
export default router