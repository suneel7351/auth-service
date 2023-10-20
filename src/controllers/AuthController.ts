
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { RegisterUserRequest } from '../types';
import { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Response } from "express";
import { validationResult } from 'express-validator';
import { TokenService } from '../services/Tokenservice'


export class AuthController {
    constructor(private userService: UserService, private logger: Logger, private tokenService: TokenService) {
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


            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role
            }



            const accessToken = this.tokenService.generateAccessToken(payload)


            // CONFIG.REFRESH_TOKEN_SECRET! iska mtlb sure hain ki ye string hogi empty nhi hoga


            // persist the refresh token


            const newRefreshToken = await this.tokenService.persistRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({ ...payload, id: String(newRefreshToken.id) })

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                domain: "localhost",
                maxAge: 1000 * 60 * 60,
            })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                domain: "localhost",
                maxAge: 1000 * 60 * 60 * 24 * 15
            })

            res.status(201).json()
        } catch (error) {
            // console.log(error);

            next(error)
        }

    }
}