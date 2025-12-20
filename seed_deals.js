
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({ take: 4 });

    if (products.length === 0) {
        console.log("No products found to update.");
        return;
    }

    for (const product of products) {
        const originalPrice = Number(product.price) * 1.2; // 20% higher
        await prisma.product.update({
            where: { id: product.id },
            data: {
                isDeal: true,
                stock: 3, // Low stock for "Son 3 Ürün" badge
                originalPrice: originalPrice,
            }
        });
        console.log(`Updated product ${product.id} as Deal.`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
