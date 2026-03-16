import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

export default async function Layout() {
  const locale = await getLocaleFromCookie();
  const t = getTranslator(locale);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold tracking-tight gradient-title">
          {t("sidebar.dashboard")}
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#f97316" />}>
        
        <DashboardPage />
      </Suspense>
    </div>);

}
