"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Calendar } from
"lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator } from
"@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from
"@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

const ITEMS_PER_PAGE = 10;

export function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { t } = useLanguage();

  const RECURRING_INTERVALS = {
    DAILY: t("transactionTable.daily"),
    WEEKLY: t("transactionTable.weekly"),
    MONTHLY: t("transactionTable.monthly"),
    YEARLY: t("transactionTable.yearly")
  };

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [monthFilter, setMonthFilter] = useState(currentMonthStr);


  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });

    months.add(currentMonthStr);
    return Array.from(months).sort().reverse();
  }, [transactions, currentMonthStr]);


  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];


    if (monthFilter && monthFilter !== "all") {
      const [year, month] = monthFilter.split("-").map(Number);
      result = result.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
    }


    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
      transaction.description?.toLowerCase().includes(searchLower)
      );
    }


    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }


    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }


    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig, monthFilter]);


  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
      current.field === field && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
    current.includes(id) ?
    current.filter((item) => item !== id) :
    [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
    current.length === paginatedTransactions.length ?
    [] :
    paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
    !window.confirm(
      t("transactionTable.confirmDelete", { count: selectedIds.length })
    ))

    return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success(t("transactionTable.deletedSuccess"));
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setMonthFilter(currentMonthStr);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {deleteLoading &&
      <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      }
      {}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("transactionTable.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8" />

        </div>
        <div className="flex gap-2">
          <Select
            value={monthFilter}
            onValueChange={(value) => {
              setMonthFilter(value);
              setCurrentPage(1);
            }}>

            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-1" />
              <SelectValue placeholder={t("transactionTable.selectMonth")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("transactionTable.allMonths")}</SelectItem>
              {availableMonths.map((m) => {
                const [y, mo] = m.split("-");
                const label = new Date(y, mo - 1).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric"
                });
                return (
                  <SelectItem key={m} value={m}>
                    {label}
                  </SelectItem>);

              })}
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}>

            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("transactionTable.allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">{t("transactionTable.income")}</SelectItem>
              <SelectItem value="EXPENSE">{t("transactionTable.expense")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}>

            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("transactionTable.allTransactions")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">{t("transactionTable.recurringOnly")}</SelectItem>
              <SelectItem value="non-recurring">{t("transactionTable.nonRecurringOnly")}</SelectItem>
            </SelectContent>
          </Select>

          {}
          {selectedIds.length > 0 &&
          <div className="flex items-center gap-2">
              <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}>

                <Trash className="h-4 w-4 mr-2" />
                {t("transactionTable.deleteSelected")} ({selectedIds.length})
              </Button>
            </div>
          }

          {(searchTerm || typeFilter || recurringFilter || monthFilter !== currentMonthStr) &&
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearFilters}
            title={t("transactionTable.clearFilters")}>

              <X className="h-4 w-5" />
            </Button>
          }
        </div>
      </div>

      {}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                  selectedIds.length === paginatedTransactions.length &&
                  paginatedTransactions.length > 0
                  }
                  onCheckedChange={handleSelectAll} />

              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}>

                <div className="flex items-center">
                  {t("transactionTable.date")}
                  {sortConfig.field === "date" && (
                  sortConfig.direction === "asc" ?
                  <ChevronUp className="ml-1 h-4 w-4" /> :

                  <ChevronDown className="ml-1 h-4 w-4" />)
                  }
                </div>
              </TableHead>
              <TableHead>{t("transactionTable.description")}</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}>

                <div className="flex items-center">
                  {t("transactionTable.category")}
                  {sortConfig.field === "category" && (
                  sortConfig.direction === "asc" ?
                  <ChevronUp className="ml-1 h-4 w-4" /> :

                  <ChevronDown className="ml-1 h-4 w-4" />)
                  }
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}>

                <div className="flex items-center justify-end">
                  {t("transactionTable.amount")}
                  {sortConfig.field === "amount" && (
                  sortConfig.direction === "asc" ?
                  <ChevronUp className="ml-1 h-4 w-4" /> :

                  <ChevronDown className="ml-1 h-4 w-4" />)
                  }
                </div>
              </TableHead>
              <TableHead>{t("transactionTable.recurring")}</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ?
            <TableRow>
                <TableCell
                colSpan={7}
                className="text-center text-muted-foreground">

                  {t("transactionTable.noTransactions")}
                </TableCell>
              </TableRow> :

            paginatedTransactions.map((transaction) =>
            <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                  checked={selectedIds.includes(transaction.id)}
                  onCheckedChange={() => handleSelect(transaction.id)} />

                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                  style={{
                    background: categoryColors[transaction.category]
                  }}
                  className="px-2 py-1 rounded text-white text-sm">

                      {t(`categories.${transaction.category}`, {}, transaction.category)}
                    </span>
                  </TableCell>
                  <TableCell
                className={cn(
                  "text-right font-medium",
                  transaction.type === "EXPENSE" ?
                  "text-red-500" :
                  "text-green-500"
                )}>

                    {transaction.type === "EXPENSE" ? "-" : "+"}₹
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ?
                <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                        variant="secondary"
                        className="gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200">

                              <RefreshCw className="h-3 w-3" />
                              {
                        RECURRING_INTERVALS[
                        transaction.recurringInterval]

                        }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">{t("transactionTable.nextDate")}</div>
                              <div>
                                {format(
                            new Date(transaction.nextRecurringDate),
                            "PPP"
                          )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider> :

                <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {t("transactionTable.oneTime")}
                      </Badge>
                }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                      onClick={() =>
                      router.push(
                        `/transaction/create?edit=${transaction.id}`
                      )
                      }>

                          {t("transactionTable.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteFn([transaction.id])}>

                          {t("transactionTable.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
            )
            }
          </TableBody>
        </Table>
      </div>

      {}
      {totalPages > 1 &&
      <div className="flex items-center justify-center gap-2">
          <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>

            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {t("transactionTable.page")} {currentPage} {t("transactionTable.of")} {totalPages}
          </span>
          <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>

            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      }
    </div>);

}
