import { AppDataSource } from "./config/data-source"
import { logger } from "./config/logger"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    const user = new User()
    user.firstName = "Suneel"
    user.lastName = "Rajput"
    user.email = "rsuneel47@gmail.com"
    user.password = "password"
    await AppDataSource.manager.save(user)

    await AppDataSource.manager.find(User)


}).catch(error => { logger.error(error) })
