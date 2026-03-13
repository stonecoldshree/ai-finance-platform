"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const ACCOUNT_ID = "account-id";
const USER_ID = "user-id";



const CATEGORIES = {
  INCOME: [
  { name: "salary", range: [5000, 8000], merchants: ["Employer Inc.", "TechCorp Ltd.", "ABC Solutions"] },
  { name: "freelance", range: [1000, 3000], merchants: ["Upwork Client", "Fiverr Gig", "Direct Client"] },
  { name: "investments", range: [500, 2000], merchants: ["Zerodha", "Groww", "Mutual Fund SIP"] },
  { name: "other-income", range: [100, 1000], merchants: ["Cashback", "Refund", "Gift Money"] }],

  EXPENSE: [
  { name: "housing", range: [8000, 20000], merchants: ["Landlord", "Society Maintenance", "Home Repairs Co."] },
  { name: "transportation", range: [100, 500], merchants: ["Uber", "Ola", "Metro Card", "Petrol Pump", "Rapido"] },
  { name: "groceries", range: [200, 2500], merchants: ["BigBasket", "Blinkit", "D-Mart", "Reliance Fresh", "Local Kirana"] },
  { name: "utilities", range: [100, 800], merchants: ["Electricity Board", "Jio Fiber", "Airtel", "Gas Agency", "Water Board"] },
  { name: "entertainment", range: [50, 800], merchants: ["Netflix", "BookMyShow", "Spotify", "Amazon Prime", "Hotstar"] },
  { name: "food", range: [50, 600], merchants: ["Swiggy", "Zomato", "Starbucks", "Dominos", "Local Restaurant"] },
  { name: "shopping", range: [100, 3000], merchants: ["Amazon", "Flipkart", "Myntra", "Mall Purchase", "Croma"] },
  { name: "healthcare", range: [100, 2000], merchants: ["Apollo Pharmacy", "Dr. Visit", "Lab Test", "Hospital", "1mg"] },
  { name: "education", range: [200, 5000], merchants: ["Udemy", "Coursera", "Book Store", "Tuition Fee", "Exam Fee"] },
  { name: "travel", range: [500, 8000], merchants: ["MakeMyTrip", "IRCTC", "Hotel Booking", "Bus Ticket", "Airlines"] },
  { name: "personal", range: [100, 1000], merchants: ["Salon", "Gym Membership", "Spa", "Laundry"] },
  { name: "insurance", range: [500, 3000], merchants: ["LIC", "HDFC Life", "Car Insurance", "Health Insurance"] },
  { name: "gifts", range: [200, 2000], merchants: ["Gift Shop", "Online Gift", "Donation", "Birthday Gift"] },
  { name: "bills", range: [100, 1000], merchants: ["Credit Card Bill", "Loan EMI", "Service Charge", "Bank Fee"] },
  { name: "other-expense", range: [50, 500], merchants: ["Misc Purchase", "ATM Withdrawal", "Other"] }]

};


const EXPENSE_DESCRIPTIONS = [
"Payment to {merchant}",
"Purchase at {merchant}",
"{merchant} - monthly",
"Paid {merchant}",
"{merchant} transaction"];


const INCOME_DESCRIPTIONS = [
"Received from {merchant}",
"{merchant} - credit",
"Income: {merchant}",
"{merchant} deposit"];




function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = getRandomElement(categories);
  const amount = getRandomAmount(category.range[0], category.range[1]);
  const merchant = getRandomElement(category.merchants);
  const templates = type === "INCOME" ? INCOME_DESCRIPTIONS : EXPENSE_DESCRIPTIONS;
  const description = getRandomElement(templates).replace("{merchant}", merchant);
  return { category: category.name, amount, description, merchant };
}


function generateAnomalousTransaction(date) {
  const anomalyTypes = [
  { category: "shopping", amount: getRandomAmount(15000, 50000), description: "Unusual large purchase at Electronics Store" },
  { category: "travel", amount: getRandomAmount(20000, 60000), description: "Unexpected international booking" },
  { category: "healthcare", amount: getRandomAmount(10000, 40000), description: "Emergency hospital payment" },
  { category: "food", amount: getRandomAmount(5000, 15000), description: "Large party catering order" }];


  const anomaly = getRandomElement(anomalyTypes);
  return {
    id: crypto.randomUUID(),
    type: "EXPENSE",
    amount: anomaly.amount,
    description: `[ANOMALY] ${anomaly.description}`,
    date,
    category: anomaly.category,
    status: "COMPLETED",
    userId: USER_ID,
    accountId: ACCOUNT_ID,
    createdAt: date,
    updatedAt: date,
    isAnomaly: true
  };
}



export async function seedTransactions() {
  try {
    const transactions = [];
    let totalBalance = 0;
    const DAYS = 365;
    const anomalyIndices = new Set();


    for (let i = 0; i < Math.floor(DAYS * 0.05); i++) {
      anomalyIndices.add(Math.floor(Math.random() * DAYS));
    }

    for (let i = DAYS; i >= 0; i--) {
      const date = subDays(new Date(), i);


      const transactionsPerDay = Math.floor(Math.random() * 6) + 3;

      for (let j = 0; j < transactionsPerDay; j++) {

        const type = Math.random() < 0.35 ? "INCOME" : "EXPENSE";
        const { category, amount, description } = getRandomCategory(type);

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
      }


      if (anomalyIndices.has(i)) {
        const anomaly = generateAnomalousTransaction(date);
        totalBalance -= anomaly.amount;
        transactions.push(anomaly);
      }
    }


    await db.$transaction(async (tx) => {

      await tx.transaction.deleteMany({
        where: { accountId: ACCOUNT_ID }
      });


      const BATCH_SIZE = 500;
      for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
        const batch = transactions.slice(i, i + BATCH_SIZE).map((t) => {

          const { isAnomaly, merchant, ...dbTransaction } = t;
          return dbTransaction;
        });
        await tx.transaction.createMany({ data: batch });
      }


      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance }
      });
    });


    const anomalyCount = transactions.filter((t) => t.isAnomaly).length;

    return {
      success: true,
      message: `Created ${transactions.length} transactions (${anomalyCount} anomalies) over ${DAYS} days`,
      stats: {
        totalTransactions: transactions.length,
        anomalies: anomalyCount,
        days: DAYS,
        avgPerDay: (transactions.length / DAYS).toFixed(1)
      }
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
