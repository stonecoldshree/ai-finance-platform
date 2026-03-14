import { getRecurringTransactions } from "@/actions/transaction";
import RecurringTransactionsClient from "./_components/recurring-transactions-client";

export default async function RecurringTransactionsPage() {
  const recurringResult = await getRecurringTransactions();

  return (
    <div className="px-5 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">Recurring Center</h1>
      <p className="text-sm text-muted-foreground">
        Manage subscriptions, rent, and autopay schedules in one place.
      </p>
      <RecurringTransactionsClient initialItems={recurringResult?.data || []} />
    </div>
  );
}
