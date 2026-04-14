import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GENERATED_NOTIFICATION_LOCALES } from "../lib/i18n/generated-notification-locales.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updates = {
  ta: {
    notifications: {
      transactionSuccessCompact:
        "குல்லாக்: {category} இல் ₹{amount} பரிவர்த்தனை பதிவு செய்யப்பட்டது."
    }
  },
  te: {
    notifications: {
      transactionSuccessCompact:
        "గుల్లక్: {category}లో ₹{amount} లావాదేవీ నమోదు చేయబడింది."
    }
  },
  kn: {
    notifications: {
      transactionSuccessCompact:
        "ಗುಲ್ಲಕ್: {category} ನಲ್ಲಿ ₹{amount} ವಹಿವಾಟು ದಾಖಲಾಗಿದೆ."
    }
  },
  ml: {
    notifications: {
      transactionSuccessCompact:
        "ഗുല്ലക്ക്: {category}ൽ ₹{amount} ഇടപാട് രേഖപ്പെടുത്തി."
    }
  },
  mr: {
    notifications: {
      transactionSuccessCompact:
        "गुलक: {category} मध्ये ₹{amount} व्यवहार नोंदवला गेला."
    }
  },
  raj: {
    notifications: {
      transactionSuccess:
        "गुल्लक: \"{description}\" ({category}) खातिर ₹{amount} रो लेनदेन दर्ज थयो।",
      transactionSuccessCompact:
        "गुल्लक: {category} में ₹{amount} रो लेनदेन दर्ज थयो।"
    }
  },
  bn: {
    notifications: {
      transactionSuccessCompact:
        "গুল্লাক: {category}-এ ₹{amount} লেনদেন রেকর্ড করা হয়েছে।"
    }
  },
  gu: {
    notifications: {
      transactionSuccessCompact:
        "ગુલક: {category}માં ₹{amount} નો વ્યવહાર નોંધાયો."
    }
  },
  pa: {
    notifications: {
      transactionSuccessCompact:
        "ਗੁਲਕ: {category} ਵਿੱਚ ₹{amount} ਦਾ ਲੈਣ-ਦੇਣ ਦਰਜ ਹੋਇਆ।"
    }
  },
  or: {
    notifications: {
      transactionSuccess:
        "ଗୁଲାକ୍: \"{description}\" ({category}) ପାଇଁ ₹{amount} ର କାରବାର ରେକର୍ଡ ହୋଇଛି |",
      transactionSuccessCompact:
        "ଗୁଲାକ୍: {category} ରେ ₹{amount} ର କାରବାର ରେକର୍ଡ ହୋଇଛି |"
    }
  }
};

for (const [locale, patch] of Object.entries(updates)) {
  if (!GENERATED_NOTIFICATION_LOCALES[locale]) continue;
  GENERATED_NOTIFICATION_LOCALES[locale] = {
    ...GENERATED_NOTIFICATION_LOCALES[locale],
    notifications: {
      ...(GENERATED_NOTIFICATION_LOCALES[locale].notifications || {}),
      ...(patch.notifications || {})
    }
  };
}

const outPath = path.join(__dirname, "..", "lib", "i18n", "generated-notification-locales.js");
const content = `export const GENERATED_NOTIFICATION_LOCALES = ${JSON.stringify(GENERATED_NOTIFICATION_LOCALES, null, 2)};\n`;
fs.writeFileSync(outPath, content, "utf8");

console.log(`Updated semantic locale copy in ${outPath}`);
