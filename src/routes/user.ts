/* eslint-disable @typescript-eslint/no-misused-promises */

import { NextFunction, Request, Response, Router } from 'express'
import { AppDataSource } from '../config/data-source'
import { User as UserTable } from '../entity/User'
import authenticate from '../middleware/authenticate'
import { canAccess } from '../middleware/canAccess'
import { Roles } from '../constants'
import User from '../controllers/UserController'
import { UserService } from '../services/UserService'

const router = Router()
const userRepo = AppDataSource.getRepository(UserTable)
const userService = new UserService(userRepo)
const userObject = new User(userService)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) => userObject.create(req, res, next))

export default router