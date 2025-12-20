import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // HARDCODED CONNECTION STRING (Debug)
    const url = "mysql://wolfbilisim_wolf_user:%299RoM%3BU1%26F.I@78.142.209.112:3306/wolfbilisim_wolf_db";
    console.log("Using HARDCODED connection string for debugging.");

    return new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
