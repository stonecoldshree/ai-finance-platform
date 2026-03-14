import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import ReportsClient from "./_components/reports-client";

export default async function ReportsPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData({ includeAllMonths: true })
  ]);

  return (
    <div className="px-5 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">Reports</h1>
      <p className="text-sm text-muted-foreground">
        Generate monthly exports for budgeting, internships, and planning.
      </p>
      <ReportsClient accounts={accounts || []} transactions={transactions || []} />
    </div>
  );
}
