import { CreateUserRequest, UpdateUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { NextFunction, Request, Response } from "express";
import { Roles } from "../constants";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";

export default class User {
    constructor(private userService: UserService, private logger: Logger) { }
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        try {
            const result = validationResult(req)
            if (!result.isEmpty()) {

                return res.status(400).json({ error: result.array() })
            }
            const { firstName, lastName, email, password } = req.body
            const user = await this.userService.createUser({ firstName, lastName, email, password, role: Roles.MANAGER })
            res.status(201).json({ id: user.id })
        } catch (error) {
            return next(error)
        }
    }

    async update(req: UpdateUserRequest, res: Response, next: NextFunction) {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, role } = req.body;
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        this.logger.debug("Request for updating a user", req.body);

        try {
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                role,
            });

            this.logger.info("User has been updated", { id: userId });

            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAll();

            this.logger.info("All users have been fetched");
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        try {
            const user = await this.userService.findById(Number(userId));

            if (!user) {
                next(createHttpError(400, "User does not exist."));
                return;
            }

            this.logger.info("User has been fetched", { id: user.id });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        try {
            await this.userService.deleteById(Number(userId));

            this.logger.info("User has been deleted", {
                id: Number(userId),
            });
            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }
}