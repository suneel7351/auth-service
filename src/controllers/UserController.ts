import { CreateUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { NextFunction, Response } from "express";
import { Roles } from "../constants";

export default class User {
    constructor(private userService: UserService) { }
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password } = req.body
            const user = await this.userService.createUser({ firstName, lastName, email, password, role: Roles.MANAGER })
            res.status(201).json({ id: user.id })
        } catch (error) {
            return next(error)
        }
    }
}