"use client";

import { useLanguage } from "@/components/language-provider";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";

const LanguageSwitcher = ({ className = "" }) => {
  const { locale, setLocale } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(event) => setLocale(event.target.value)}
      aria-label="Select language"
      className={`h-9 rounded-md border bg-background px-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring ${className}`.trim()}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <option key={code} value={code}>
          {LOCALE_LABELS[code]}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
