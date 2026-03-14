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
import { buildMonthRangeFromTransactions, formatMonthValue, getCurrentMonthValue, toMonthValue } from "@/lib/month-range";
import { toast } from "sonner";

export default function ReportsClient({ accounts = [], transactions = [] }) {
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
      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const hasAnyTransactions = transactions.length > 0;

  return (
    <div className="space-y-4">
      <Card className="border-orange-100/70 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {formatMonthValue(month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger>
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Income + Expenses</SelectItem>
              <SelectItem value="INCOME">Income Only</SelectItem>
              <SelectItem value="EXPENSE">Expense Only</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleDownload} disabled={downloading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Preparing..." : "Download CSV"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="text-2xl font-bold text-green-500">₹{totals.income.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-2xl font-bold text-red-500">₹{totals.expenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net</p>
            <p className={`text-2xl font-bold ${totals.income - totals.expenses >= 0 ? "text-green-500" : "text-red-500"}`}>
              ₹{(totals.income - totals.expenses).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Preview ({filteredTransactions.length} transactions)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {!hasAnyTransactions && (
            <div className="space-y-3 rounded-lg border border-orange-200/70 bg-orange-50/50 p-4 text-center dark:border-orange-900/40 dark:bg-orange-950/20">
              <p className="text-muted-foreground">No transactions found yet. Add entries to generate your first report.</p>
              <Link href="/transaction/create" className="inline-flex">
                <Button size="sm">Add Transaction</Button>
              </Link>
            </div>
          )}

          {filteredTransactions.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded border p-2">
              <div>
                <p className="font-medium">{transaction.description || "Untitled"}</p>
                <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()} - {transaction.category}</p>
              </div>
              <p className={transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"}>
                ₹{transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
          {hasAnyTransactions && filteredTransactions.length === 0 && (
            <p className="text-muted-foreground">No transactions match these filters. Try All Accounts or Income + Expenses.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
