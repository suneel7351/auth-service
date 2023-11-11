import { Request } from 'express'
import { CONFIG } from '../config/index'
import { GetVerificationKey, expressjwt } from 'express-jwt'
import jwksClient from 'jwks-rsa'
import { AuthCookie } from "../types/index";
export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: CONFIG.JWKS_URI!,
        cache: true,
        rateLimit: true
    }) as GetVerificationKey,
    algorithms: ['RS256'],
    getToken(req: Request) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.split(" ")[1] !== 'undefined') {
            const token = authHeader.split(" ")[1]
            if (token) {
                return token
            }
        }

        const { accessToken } = req.cookies as AuthCookie
        return accessToken

    },


})