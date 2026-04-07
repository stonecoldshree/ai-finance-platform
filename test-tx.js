const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const txs = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  fs.writeFileSync('test-tx-out.txt', JSON.stringify(txs, null, 2), 'utf8');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
