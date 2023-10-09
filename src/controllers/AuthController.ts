
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { RegisterUserRequest } from '../types';

import { NextFunction, Response } from "express";
import { validationResult } from 'express-validator';


export class AuthController {
    constructor(private userService: UserService, private logger: Logger) {
        this.userService = userService

    }

    async register(req: RegisterUserRequest, res: Response, next: NextFunction) {

        const result = validationResult(req)
        if (!result.isEmpty()) {

            return res.status(400).json({ error: result.array() })
        }

        const { firstName, lastName, email, password } = req.body
        this.logger.debug("Request for register user", { firstName, lastName, email, password: "****" })

        try {
            const user = await this.userService.createUser({ firstName, lastName, email, password })


            this.logger.info("User has been registered", { id: user.id })
            res.status(201).json()
        } catch (error) {
            next(error)
        }

    }
}