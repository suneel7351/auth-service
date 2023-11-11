import createHttpError from "http-errors";
import { AuthRequest } from "../types";
import { NextFunction, Request, Response } from "express"

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest
        const role = _req.auth.role
        if (!roles.includes(role)) {
            const err = createHttpError(403, "You don't have enough permissions")
            next(err)
            return
        }
        next()

    }
}