import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getAccountsBudgetStatus } from "@/actions/budget";
import DashboardClient from "./_components/dashboard-client";

export default async function DashboardPage() {
  const [accounts = [], transactions = [], budgetStatus = []] = await Promise.all([
  getUserAccounts(),
  getDashboardData({ includeAllMonths: true }),
  getAccountsBudgetStatus()]
  );

  return (
    <DashboardClient
      accounts={accounts || []}
      transactions={transactions || []}
      budgetStatus={budgetStatus || []} />);

}
