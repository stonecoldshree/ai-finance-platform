import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import DashboardClient from "./_components/dashboard-client";

export default async function DashboardPage() {
  const [accounts = [], transactions = []] = await Promise.all([
  getUserAccounts(),
  getDashboardData({ includeAllMonths: true })]
  );

  return (
    <DashboardClient accounts={accounts || []} transactions={transactions || []} />);

}
