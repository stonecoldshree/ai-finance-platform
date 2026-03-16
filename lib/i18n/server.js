import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, resolveLocale, resolveLocaleFromAcceptLanguage } from "./config";

export const getLocaleFromCookie = async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get("locale")?.value;
  if (cookieLocale) {
    return resolveLocale(cookieLocale);
  }

  const accepted = headerStore.get("accept-language");
  return resolveLocaleFromAcceptLanguage(accepted ?? DEFAULT_LOCALE);
};
