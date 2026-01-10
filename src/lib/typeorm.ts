import "server-only";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Trip } from "../entities/Trip";
import { Expense } from "../entities/Expense";
import { Province } from "../entities/Province";
import { TripMember } from "../entities/TripMember";
import { TripTemplate } from "../entities/TripTemplate";
import { TripTemplateDay } from "../entities/TripTemplateDay";
import { TripTemplateActivity } from "../entities/TripTemplateActivity";

const globalForTypeORM = global as unknown as { appDataSource: DataSource };

export const AppDataSource = globalForTypeORM.appDataSource || new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // Set to false in production, use migrations
    logging: process.env.NODE_ENV === "development",
    entities: [
        User,
        Trip,
        Expense,
        Province,
        TripMember,
        TripTemplate,
        TripTemplateDay,
        TripTemplateActivity
    ],
    migrations: [],
    subscribers: [],
});

if (process.env.NODE_ENV !== "production") {
    globalForTypeORM.appDataSource = AppDataSource;
}

export const initializeDataSource = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return AppDataSource;
};
