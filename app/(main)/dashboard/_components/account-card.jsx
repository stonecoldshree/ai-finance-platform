"use client";

import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from
"@/components/ui/alert-dialog";
import Link from "next/link";
import { updateDefaultAccount, deleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { useLanguage } from "@/components/language-provider";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const { t } = useLanguage();

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleteResult,
    error: deleteError
  } = useFetch(deleteAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning(t("accountCard.needDefaultAccount"));
      return;
    }

    await updateDefaultFn(id);
  };

  const handleDelete = async () => {
    if (isDefault) {
      toast.error(t("accountCard.cannotDeleteDefault"));
      return;
    }
    await deleteFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success(t("accountCard.defaultUpdated"));
    }
  }, [updatedAccount, t]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || t("accountCard.failedUpdateDefault"));
    }
  }, [error, t]);

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success(t("accountCard.accountDeleted"));
    } else if (deleteResult && !deleteResult.success) {
      toast.error(deleteResult.error || t("accountCard.failedDelete"));
    }
  }, [deleteResult, t]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || t("accountCard.failedDelete"));
    }
  }, [deleteError, t]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading} />
          
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {t(`accountTypes.${type}`, {}, type.charAt(0) + type.slice(1).toLowerCase())} {t("accountCard.accountLabel")}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            {t("accountCard.income")}
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            {t("accountCard.expense")}
          </div>
        </CardFooter>
      </Link>

      {}
      {!isDefault &&
      <div className="absolute top-2 right-24 z-10" onClick={(e) => e.stopPropagation()}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
              
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("accountCard.deleteTitle", { name })}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("accountCard.deleteDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("accountCard.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">

                  {deleteLoading ? t("accountCard.deleting") : t("accountCard.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    </Card>);

}
