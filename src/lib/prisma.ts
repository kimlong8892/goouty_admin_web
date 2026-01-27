import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: any };

export const prisma = (() => {
    // Nếu đã có instance, kiểm tra xem nó có đầy đủ các model mới không
    if (globalForPrisma.prisma) {
        const requiredModels = ['user', 'trip', 'expense', 'province', 'admin', 'pendingTripTemplate'];
        const hasAllModels = requiredModels.every(model => model in globalForPrisma.prisma);

        if (hasAllModels) {
            return globalForPrisma.prisma;
        }
        console.log("⚠️ Prisma instance is stale or missing models. Re-initializing...");
    }

    console.log("🚀 Initializing new PrismaClient...");
    const connectionString = process.env.DATABASE_URL!;

    const client = new PrismaClient({
        adapter: new PrismaPg(new pg.Pool({ connectionString })),
        log: ["error", "warn"]
    });

    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    return client;
})();
