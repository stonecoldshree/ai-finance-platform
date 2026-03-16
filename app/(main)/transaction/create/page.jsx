import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

export default async function AddTransactionPage({ searchParams }) {
  const locale = await getLocaleFromCookie();
  const t = getTranslator(locale);
  const accounts = await getUserAccounts();
  const resolvedSearchParams = await searchParams;
  const editId = resolvedSearchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl font-bold pb-5 text-primary">
          {editId ? t("transaction.editTransactionTitle") : t("transaction.addTransactionTitle")}
        </h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData} />
      
    </div>);

}
