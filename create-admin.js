const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs"); // assuming bcryptjs is installed

const prisma = new PrismaClient();

async function main() {
    const username = "wolfbilisim1";
    const password = "admin142536";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upsert so we don't crash if it exists
        const admin = await prisma.admin.upsert({
            where: { username },
            update: { passwordHash: hashedPassword },
            create: { username, passwordHash: hashedPassword },
        });

        console.log("Admin user created/updated:", admin.username);
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
