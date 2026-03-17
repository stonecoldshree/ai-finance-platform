import { getRecurringTransactions } from "@/actions/transaction";
import RecurringTransactionsClient from "./_components/recurring-transactions-client";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

export default async function RecurringTransactionsPage() {
  const [recurringResult, locale] = await Promise.all([
    getRecurringTransactions(),
    getLocaleFromCookie()
  ]);
  const t = getTranslator(locale);

  return (
    <div className="px-5 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">{t("recurring.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("recurring.subtitle")}
      </p>
      <RecurringTransactionsClient initialItems={recurringResult?.data || []} />
    </div>
  );
}
