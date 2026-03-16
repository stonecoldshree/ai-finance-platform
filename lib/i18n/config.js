export const SUPPORTED_LOCALES = [
  "en",
  "hi",
  "ta",
  "te",
  "kn",
  "ml",
  "mr",
  "raj",
  "bn",
  "gu",
  "pa",
  "or"
];

export const DEFAULT_LOCALE = "en";

export const LOCALE_LABELS = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  mr: "मराठी",
  raj: "राजस्थानी",
  bn: "বাংলা",
  gu: "ગુજરાતી",
  pa: "ਪੰਜਾਬੀ",
  or: "ଓଡ଼ିଆ"
};

const LOCALE_ALIASES = {
  "hi-in": "hi",
  "ta-in": "ta",
  "te-in": "te",
  "kn-in": "kn",
  "ml-in": "ml",
  "mr-in": "mr",
  "bn-in": "bn",
  "gu-in": "gu",
  "pa-in": "pa",
  "pa-guru": "pa",
  od: "or",
  "or-in": "or",
  "raj-in": "raj"
};

export const normalizeLocale = (value) => {
  if (!value) return "";
  const normalized = String(value).toLowerCase();
  return LOCALE_ALIASES[normalized] ?? normalized;
};

export const isSupportedLocale = (value) =>
SUPPORTED_LOCALES.includes(value);

export const resolveLocale = (value) => {
  const normalized = normalizeLocale(value);
  return isSupportedLocale(normalized) ? normalized : DEFAULT_LOCALE;
};

const parseAcceptLanguage = (headerValue) => {
  if (!headerValue) return [];

  return headerValue
  .split(",")
  .map((part) => {
    const [tagPart, ...params] = part.trim().split(";");
    const qParam = params.find((param) => param.trim().startsWith("q="));
    const quality = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
    return {
      tag: normalizeLocale(tagPart),
      quality: Number.isFinite(quality) ? quality : 0
    };
  })
  .filter((item) => item.tag)
  .sort((a, b) => b.quality - a.quality);
};

export const resolveLocaleFromAcceptLanguage = (headerValue) => {
  const parsed = parseAcceptLanguage(headerValue);

  for (const { tag } of parsed) {
    if (isSupportedLocale(tag)) {
      return tag;
    }

    const baseTag = normalizeLocale(tag.split("-")[0]);
    if (isSupportedLocale(baseTag)) {
      return baseTag;
    }
  }

  return DEFAULT_LOCALE;
};
