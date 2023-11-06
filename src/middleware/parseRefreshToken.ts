import { CONFIG } from "../config/index";
import { AuthCookie } from "../types/index";
import { Request } from "express";
import { expressjwt } from "express-jwt";

export default expressjwt({
    secret: CONFIG.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie
        return refreshToken
    },

})