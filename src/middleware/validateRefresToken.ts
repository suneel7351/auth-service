import { AppDataSource } from "../config/data-source";
import { CONFIG } from "../config/index";
import { AuthCookie, IRefreskTokenPayload } from "../types/index";
import { Request } from "express";
import { expressjwt } from "express-jwt";
import { RefreshToken } from "../entity/RefreshToken";
import { logger } from "../config/logger";

export default expressjwt({
    secret: CONFIG.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie
        return refreshToken
    },
    async isRevoked(request: Request, token) {

        try {
            const repo = AppDataSource.getRepository(RefreshToken)
            const refreshToken = await repo.findOne({
                where: {
                    id: Number((token?.payload as IRefreskTokenPayload).id),
                    user: {
                        id: Number(token?.payload.sub)
                    }
                }
            })
            return refreshToken === null
        } catch (error) {
            logger.error("Error while getting the refresh token", { id: (token?.payload as IRefreskTokenPayload).id })
        }
        return true
    }
})