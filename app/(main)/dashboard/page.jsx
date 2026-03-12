import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { DashboardOverview } from "./_components/transaction-overview";
import { DashboardSummary } from "./_components/dashboard-summary";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <DashboardSummary
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />
    </div>
  );
}
