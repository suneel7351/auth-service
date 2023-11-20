import { Repository } from "typeorm";
import { Tenant } from "./entity/Tenant";

export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 10);
};

export const createTenant = async (repo: Repository<Tenant>) => {
    return await repo.save({ name: "suneel", address: "kanpur" })
}