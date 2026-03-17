import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

export default async function AccountPage({ params }) {
  const { id } = await params;
  const [accountData, locale] = await Promise.all([
    getAccountWithTransactions(id),
    getLocaleFromCookie()
  ]);
  const t = getTranslator(locale);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            {t("account.accountLabel")}
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ₹{parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("account.transactionsCount", { count: account._count.transactions })}
          </p>
        </div>
      </div>

      {}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        
        <AccountChart transactions={transactions} />
      </Suspense>

      {}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>);

}
