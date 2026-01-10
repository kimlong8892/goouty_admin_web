import { prisma } from "./src/lib/prisma";

async function main() {
    const p = prisma as any;
    const models = ['user', 'trip', 'expense', 'province', 'admin'];
    console.log("Checking models on prisma instance:");
    models.forEach(m => {
        console.log(`${m}: ${typeof p[m]} (defined: ${!!p[m]})`);
    });

    if (p.expense) {
        console.log("expense.aggregate type:", typeof p.expense.aggregate);
    }
}

main().catch(console.error);
