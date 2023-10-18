
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { RegisterUserRequest } from '../types';
import { JwtPayload, sign } from 'jsonwebtoken'
import { NextFunction, Response } from "express";
import { validationResult } from 'express-validator';
import fs from 'fs'
import path from 'path';
import createHttpError from 'http-errors';
import { CONFIG } from '../config/index'
import { AppDataSource } from '../config/data-source';
import { RefreshToken } from '../entity/RefreshToken';


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

            let privateKey: Buffer
            try {
                privateKey = fs.readFileSync(path.join(__dirname, "../../certs/private.pem"))
            } catch (error) {
                const err = createHttpError(500, "Error while reading private key...")
                next(err)
                return
            }
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role
            }


            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256", expiresIn: "1h", issuer: "auth-service"
            })




            // CONFIG.REFRESH_TOKEN_SECRET! iska mtlb sure hain ki ye string hogi empty nhi hoga


            // persist the refresh token

            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365

            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)

            const newRefreshToken = await refreshTokenRepo.save({
                user: user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR)
            })




            const refreshToken = sign(payload, CONFIG.REFRESH_TOKEN_SECRET!, {
                algorithm: "HS256",
                expiresIn: "15d",
                issuer: "auth-service",
                jwtid: String(newRefreshToken.id)
            })

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