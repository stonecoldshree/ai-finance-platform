"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import {
  buildMonthRangeFromTransactions,
  formatMonthValue,
  getCurrentMonthValue } from
"@/lib/month-range";
import { DashboardSummary } from "./dashboard-summary";
import { DashboardOverview } from "./transaction-overview";

export default function DashboardClient({ accounts, transactions }) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  const monthOptions = useMemo(
    () => buildMonthRangeFromTransactions(transactions),
    [transactions]
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((monthValue) =>
            <SelectItem key={monthValue} value={monthValue}>
                {formatMonthValue(monthValue)}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <DashboardSummary
        accounts={accounts}
        transactions={transactions}
        selectedMonth={selectedMonth} />
      

      <DashboardOverview
        accounts={accounts}
        transactions={transactions}
        selectedMonth={selectedMonth} />
      
    </div>);

}
