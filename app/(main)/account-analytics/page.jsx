import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import AccountAnalyticsClient from "./_components/analytics-client";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

export default async function AccountAnalyticsPage() {
  const [accounts, transactions, locale] = await Promise.all([
  getUserAccounts(),
  getDashboardData({ includeAllMonths: true }),
  getLocaleFromCookie()]
  );
  const t = getTranslator(locale);


  const budgetsByAccount = {};
  if (accounts?.length > 0) {
    const budgetPromises = accounts.map((account) =>
    getCurrentBudget(account.id).then((data) => ({
      accountId: account.id,
      ...data
    }))
    );
    const budgetResults = await Promise.all(budgetPromises);
    for (const result of budgetResults) {
      budgetsByAccount[result.accountId] = {
        budget: result.budget,
        currentExpenses: result.currentExpenses
      };
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
