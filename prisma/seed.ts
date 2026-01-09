import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('test1234', 10)

    const admin = await prisma.User.upsert({
        where: { email: 'admin@goouty.com' },
        update: {
            password: hashedPassword,
        },
        create: {
            email: 'admin@goouty.com',
            name: 'Admin',
            password: hashedPassword,
        },
    })

    console.log('Admin user seeded:', admin)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
