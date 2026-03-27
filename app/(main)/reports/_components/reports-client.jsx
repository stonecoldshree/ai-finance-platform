"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportTransactionsCsv } from "@/actions/transaction";
import { buildMonthRangeFromTransactions, formatDateValue, formatMonthValue, getCurrentMonthValue, toMonthValue } from "@/lib/month-range";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

export default function ReportsClient({ accounts = [], transactions = [] }) {
  const { t, locale } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [downloading, setDownloading] = useState(false);

  const monthOptions = useMemo(() => buildMonthRangeFromTransactions(transactions), [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesMonth = toMonthValue(transaction.date) === selectedMonth;
      const matchesAccount = selectedAccount === "all" || transaction.accountId === selectedAccount;
      const matchesType = selectedType === "all" || transaction.type === selectedType;
      return matchesMonth && matchesAccount && matchesType;
    });
  }, [transactions, selectedMonth, selectedAccount, selectedType]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "INCOME") {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  }, [filteredTransactions]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const result = await exportTransactionsCsv({
        monthValue: selectedMonth,
        accountId: selectedAccount === "all" ? null : selectedAccount,
        type: selectedType === "all" ? null : selectedType
      });

      if (!result?.success) {
        throw new Error("Failed to generate CSV");
      }

      const blob = new Blob([result.data.csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", result.data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t("reports.downloaded"));
    } catch (error) {
      toast.error(error.message || t("reports.downloadFailed"));
    } finally {
      setDownloading(false);
    }
  };

  const hasAnyTransactions = transactions.length > 0;

  return (
    <div className="space-y-4">
      <Card className="border-orange-100/70 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">{t("reports.filters")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder={t("reports.month")} />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {formatMonthValue(month, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger>
              <SelectValue placeholder={t("reports.account")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("reports.allAccounts")}</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder={t("reports.type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("reports.incomeAndExpenses")}</SelectItem>
              <SelectItem value="INCOME">{t("reports.incomeOnly")}</SelectItem>
              <SelectItem value="EXPENSE">{t("reports.expenseOnly")}</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleDownload} disabled={downloading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {downloading ? t("reports.preparing") : t("reports.downloadCsv")}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("reports.income")}</p>
            <p className="text-2xl font-bold text-green-500">₹{totals.income.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("reports.expenses")}</p>
            <p className="text-2xl font-bold text-red-500">₹{totals.expenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("reports.net")}</p>
            <p className={`text-2xl font-bold ${totals.income - totals.expenses >= 0 ? "text-green-500" : "text-red-500"}`}>
              ₹{(totals.income - totals.expenses).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("reports.preview")} ({filteredTransactions.length} {t("reports.transactions")})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {!hasAnyTransactions && (
            <div className="space-y-3 rounded-lg border border-orange-200/70 bg-orange-50/50 p-4 text-center dark:border-orange-900/40 dark:bg-orange-950/20">
              <p className="text-muted-foreground">{t("reports.noTransactionsYet")}</p>
              <Link href="/transaction/create" className="inline-flex">
                <Button size="sm">{t("reports.addTransaction")}</Button>
              </Link>
            </div>
          )}

          {filteredTransactions.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded border p-2">
              <div>
                <p className="font-medium">{transaction.description || t("reports.untitled")}</p>
                <p className="text-xs text-muted-foreground">{formatDateValue(transaction.date, locale)} - {t(`categories.${transaction.category}`, {}, transaction.category)}</p>
              </div>
              <p className={transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"}>
                ₹{transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
          {hasAnyTransactions && filteredTransactions.length === 0 && (
            <p className="text-muted-foreground">{t("reports.noMatches")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
