const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const budgets = await db.budget.findMany();
  console.log("Found", budgets.length, "budgets");

  for (const b of budgets) {
    const defaultAcc = await db.account.findFirst({
      where: { userId: b.userId, isDefault: true }
    });

    if (defaultAcc) {
      await db.budget.update({
        where: { id: b.id },
        data: { accountId: defaultAcc.id }
      });
      console.log("Updated budget", b.id, "with account", defaultAcc.id);
    } else {
      const anyAcc = await db.account.findFirst({
        where: { userId: b.userId }
      });
      if (anyAcc) {
        await db.budget.update({
          where: { id: b.id },
          data: { accountId: anyAcc.id }
        });
        console.log("Updated budget", b.id, "with account", anyAcc.id);
      } else {
        await db.budget.delete({ where: { id: b.id } });
        console.log("Deleted orphan budget", b.id);
      }
    }
  }

  console.log("Done");
  await db.$disconnect();
}

main().catch(console.error);
