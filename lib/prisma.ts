import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    // Debug logging to check environment variable presence in Vercel logs
    console.log("Initializing Prisma Client...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
        console.log("DATABASE_URL length:", process.env.DATABASE_URL.length);
    } else {
        console.error("FATAL: DATABASE_URL is undefined during initialization");
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
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
