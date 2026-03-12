import { Suspense } from "react";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "../dashboard/_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BarLoader } from "react-spinners";
import AccountAnalyticsClient from "./_components/analytics-client";

export default async function AccountAnalyticsPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  // Fetch budgets for all accounts
  const budgetsByAccount = {};
  if (accounts?.length > 0) {
    const budgetPromises = accounts.map((account) =>
      getCurrentBudget(account.id).then((data) => ({
        accountId: account.id,
        ...data,
      }))
    );
    const budgetResults = await Promise.all(budgetPromises);
    for (const result of budgetResults) {
      budgetsByAccount[result.accountId] = {
        budget: result.budget,
        currentExpenses: result.currentExpenses,
      };
    }
  }

  return (
    <div className="px-5 space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">
        Account Analytics
      </h1>

      {/* Account-level analytics with per-account budget */}
      <AccountAnalyticsClient
        accounts={accounts}
        transactions={transactions || []}
        budgetsByAccount={budgetsByAccount}
      />

      {/* Accounts Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          {accounts?.length > 0 &&
            accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}
