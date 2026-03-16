import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import ReportsClient from "./_components/reports-client";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

export default async function ReportsPage() {
  const locale = await getLocaleFromCookie();
  const t = getTranslator(locale);

  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData({ includeAllMonths: true })
  ]);

  return (
    <div className="px-5 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">{t("reports.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("reports.subtitle")}
      </p>
      <ReportsClient accounts={accounts || []} transactions={transactions || []} />
    </div>
  );
}
