import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import AccountAnalyticsClient from "./_components/analytics-client";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";
import { getAuthUser } from "@/lib/cachedAuth";
import { db } from "@/lib/prisma";

export default async function AccountAnalyticsPage() {
  const [accounts, transactions, locale] = await Promise.all([
  getUserAccounts(),
  getDashboardData({ includeAllMonths: true }),
  getLocaleFromCookie()]
  );
  const t = getTranslator(locale);


  const budgetsByAccount = {};
  if (accounts?.length > 0) {
    const user = await getAuthUser();
    const accountIds = accounts.map((account) => account.id);

    const budgetRows = await db.budget.findMany({
      where: {
        userId: user.id,
        accountId: { in: accountIds }
      },
      select: {
        accountId: true,
        budgetMonth: true,
        amount: true
      }
    });

    for (const row of budgetRows) {
      if (!budgetsByAccount[row.accountId]) {
        budgetsByAccount[row.accountId] = {};
      }

      const monthKey = row.budgetMonth || "__legacy__";
      budgetsByAccount[row.accountId][monthKey] = row.amount.toNumber();
    }
  }

  return (
    <div className="px-5 space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">
        {t("accountAnalytics.title")}
      </h1>

      {}
      <AccountAnalyticsClient
        accounts={accounts}
        transactions={transactions || []}
        budgetsByAccount={budgetsByAccount} />
      
    </div>);

}
