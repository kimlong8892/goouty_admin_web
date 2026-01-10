import "server-only";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Trip } from "../entities/Trip";
import { Expense } from "../entities/Expense";
import { Province } from "../entities/Province";
import { TripMember } from "../entities/TripMember";

const globalForTypeORM = global as unknown as { dataSource: DataSource };

export const AppDataSource = globalForTypeORM.dataSource || new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // Set to false in production, use migrations
    logging: process.env.NODE_ENV === "development",
    entities: [
        User,
        Trip,
        Expense,
        Province,
        TripMember
    ],
    migrations: [],
    subscribers: [],
});

if (process.env.NODE_ENV !== "production") {
    globalForTypeORM.dataSource = AppDataSource;
}

export const initializeDataSource = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return AppDataSource;
};
