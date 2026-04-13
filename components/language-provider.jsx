"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, resolveLocale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/translations";
import { updateUserLocale } from "@/actions/user";

const LanguageContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key, values, fallback) => fallback ?? key
});

export const LanguageProvider = ({ initialLocale = DEFAULT_LOCALE, children }) => {
  const [locale, setLocaleState] = useState(resolveLocale(initialLocale));
  const router = useRouter();

  const setLocale = useCallback(async (nextLocale) => {
    const safeLocale = resolveLocale(nextLocale);
    setLocaleState(safeLocale);
    document.cookie = `locale=${safeLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();

    updateUserLocale(safeLocale).catch((error) => {
      console.error("Failed to sync locale to DB", error);
    });
  }, [router]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key, values, fallback) => translate(locale, key, values, fallback)
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
