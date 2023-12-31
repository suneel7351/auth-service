import { LimitedUserData, UserData } from "../types";
import bcrypt from 'bcrypt'
import { User } from '../entity/User'
import { Repository } from "typeorm";
import createHttpError from "http-errors";
export class UserService {
    constructor(private userRepository: Repository<User>) { }
    async createUser({ firstName, lastName, email, password, role, tenantId }: UserData) {

        const existUser = await this.userRepository.findOne({ where: { email } })
        if (existUser !== null) {
            const error = createHttpError(400, "Email is already registered!")
            throw error
        }

        // Hash the password
        // 2^10 --> cpu intensive
        const saltRound = 10
        const hashPassword = await bcrypt.hash(password, saltRound)

        try {
            return await this.userRepository.save({ firstName, lastName, email, password: hashPassword, role, tenant: tenantId ? { id: Number(tenantId) } : undefined })
        } catch (error) {
            const err = createHttpError(500, "Data failed to store in the database")
            throw err
        }
    }


    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email }, select: ["id", "firstName", "lastName", "role", "password", "email"] })

    }

    async getById(id: number) {
        return await this.userRepository.findOne({ where: { id } })

    }


    async matchPassword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash)

    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to update the user in the database",
            );
            throw error;
        }
    }

    async getAll() {
        return await this.userRepository.find();
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
