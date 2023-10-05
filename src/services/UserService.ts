import { UserData } from "../types";

import { User } from '../entity/User'
import { Repository } from "typeorm";
export class UserService {
    constructor(private userRepository: Repository<User>) { }
    async createUser({ firstName, lastName, email, password }: UserData) {

        await this.userRepository.save({ firstName, lastName, email, password })
    }
}