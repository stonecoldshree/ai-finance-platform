"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardSummary({ accounts, transactions }) {
  const stats = useMemo(() => {
    const totalBalance = accounts.reduce(
      (sum, a) => sum + parseFloat(a.balance),
      0
    );

    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      income,
      expenses,
      accountCount: accounts.length,
    };
  }, [accounts, transactions]);

  const cards = [
    {
      label: "Total Balance",
      value: `₹${stats.totalBalance.toFixed(2)}`,
      icon: Wallet,
      color: "text-orange-500",
    },
    {
      label: "This Month Income",
      value: `₹${stats.income.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "This Month Expenses",
      value: `₹${stats.expenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      label: "Accounts",
      value: stats.accountCount,
      icon: CreditCard,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {card.label}
                </p>
                <p className={cn("text-xl md:text-2xl font-bold", card.color)}>
                  {card.value}
                </p>
              </div>
              <card.icon
                className={cn("h-8 w-8 opacity-40 shrink-0", card.color)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
