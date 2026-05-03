import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log("🚀 Starting Phase 2 & 4: Backend Integrity & Edge Case Testing...");
  
  // Find a test user to run tests against
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("❌ No users found in database to run tests against. Please create a user first.");
    process.exit(1);
  }
  
  console.log(`👤 Using Test User: ${user.email} (${user.id})`);

  let testAccount = null;
  let destAccount = null;

  try {
    // 1. Database Constraint Testing
    console.log("\n🧪 Test 1: Account Creation & Balances");
    testAccount = await prisma.account.create({
      data: {
        userId: user.id,
        name: "QA Test Source Account",
        type: "CURRENT",
        balance: 1000,
        isDefault: false
      }
    });
    
    destAccount = await prisma.account.create({
      data: {
        userId: user.id,
        name: "QA Test Dest Account",
        type: "SAVINGS",
        balance: 0,
        isDefault: false
      }
    });
    console.log("✅ Accounts created successfully.");

    // 2. Concurrency Testing
    console.log("\n🧪 Test 2: Concurrency & Race Conditions");
    console.log("Simulating 5 simultaneous expense transactions of ₹100 each...");
    
    const transactions = Array(5).fill(0).map((_, i) => {
      return prisma.$transaction(async (tx) => {
        const t = await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: testAccount.id,
            type: "EXPENSE",
            amount: 100,
            category: "test-category",
            date: new Date(),
            description: `Concurrent Test ${i}`
          }
        });
        await tx.account.update({
          where: { id: testAccount.id },
          data: { balance: { decrement: 100 } }
        });
        return t;
      });
    });

    await Promise.all(transactions);
    
    const updatedAccount = await prisma.account.findUnique({ where: { id: testAccount.id } });
    if (updatedAccount.balance.toNumber() !== 500) {
      throw new Error(`Concurrency failure. Expected balance 500, got ${updatedAccount.balance.toNumber()}`);
    }
    console.log("✅ Concurrency test passed. Transactions processed safely.");

    // 3. Negative Balance Protection
    console.log("\n🧪 Test 3: Negative Balance Protection Check");
    // (In our updated server action we added strict validation, but let's test Prisma boundaries)
    // Note: Prisma Schema uses Decimal for balance, which allows negative numbers unless strictly checked by application logic.
    console.log("⚠️ Prisma schema allows negative balances. Relying on application-layer checks (which we implemented in Phase 1).");

  } catch (error) {
    console.error("❌ Test Failed:", error);
  } finally {
    console.log("\n🧹 Cleaning up test data...");
    if (testAccount) {
      await prisma.account.delete({ where: { id: testAccount.id } });
    }
    if (destAccount) {
      await prisma.account.delete({ where: { id: destAccount.id } });
    }
    await prisma.$disconnect();
    console.log("✅ Cleanup complete.");
  }
}

runTests();
