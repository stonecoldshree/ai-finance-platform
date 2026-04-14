import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_LOCALES = {
  ta: "ta",
  te: "te",
  kn: "kn",
  ml: "ml",
  mr: "mr",
  raj: "hi",
  bn: "bn",
  gu: "gu",
  pa: "pa",
  or: "or"
};

const SECTION_KEYS = ["notifications", "emails"];

async function translateStrings(strings, to) {
  if (!Array.isArray(strings) || strings.length === 0) {
    return [];
  }

  const maps = [];
  const encoded = strings.map((value, textIndex) => {
    const tokenMap = [];
    const encodedValue = String(value).replace(/\{(\w+)\}/g, (_match, tokenName) => {
      const token = `[[${tokenMap.length}]]`;
      tokenMap.push({ token, tokenName });
      return token;
    });
    maps.push(tokenMap);
    return encodedValue;
  });

  const translated = await translate(encoded, { to });
  const list = Array.isArray(translated)
    ? translated.map((item) => item.text)
    : [translated.text];

  return list.map((value, textIndex) => {
    let restored = String(value);
    const tokenMap = maps[textIndex] || [];
    for (let i = 0; i < tokenMap.length; i += 1) {
      const { tokenName } = tokenMap[i];
      const tokenPatterns = [
        new RegExp(`\\[\\[\\s*${i}\\s*\\]\\]`, "g"),
        new RegExp(`\\[\\s*${i}\\s*\\]\\]`, "g"),
        new RegExp(`\\[\\[\\s*${i}\\s*\\]`, "g"),
        new RegExp(`\\[\\s*${i}\\s*\\]`, "g")
      ];
      for (const tokenPattern of tokenPatterns) {
        restored = restored.replace(tokenPattern, `{${tokenName}}`);
      }

      const literalVariants = [
        `[${i}]]`,
        `[${i}]`,
        `[[${i}]]`,
        `[[${i}]`,
        ` [${i}]]`,
        ` [${i}]`
      ];
      for (const variant of literalVariants) {
        restored = restored.split(variant).join(`{${tokenName}}`);
      }

      // google-translate-api-x may emit __PH_<textIndex>_<tokenIndex>__ artifacts.
      const apiPattern = new RegExp(
        `__\\s*PH\\s*_\\s*${textIndex}\\s*_+\\s*${i}\\s*_*(?:__)?`,
        "gi"
      );
      restored = restored.replace(apiPattern, `{${tokenName}}`);
    }
    return restored;
  });
}

async function run() {
  const { MESSAGES } = await import("../lib/i18n/translations.js");

  const source = {};
  for (const section of SECTION_KEYS) {
    source[section] = MESSAGES.en?.[section] || {};
  }

  const output = {};

  for (const [localeCode, gtLocale] of Object.entries(TARGET_LOCALES)) {
    output[localeCode] = {};
    console.log(`Generating locale ${localeCode} via ${gtLocale}...`);

    for (const section of SECTION_KEYS) {
      const entries = Object.entries(source[section]);
      const keys = entries.map(([key]) => key);
      const values = entries.map(([, value]) => String(value));

      const translatedValues = await translateStrings(values, gtLocale);
      output[localeCode][section] = {};

      for (let i = 0; i < keys.length; i += 1) {
        output[localeCode][section][keys[i]] = translatedValues[i] || values[i];
      }

      console.log(`  ${section}: ${keys.length} keys`);
    }
  }

  const outPath = path.join(__dirname, "..", "lib", "i18n", "generated-notification-locales.js");
  const fileContent = `export const GENERATED_NOTIFICATION_LOCALES = ${JSON.stringify(output, null, 2)};\n`;
  fs.writeFileSync(outPath, fileContent, "utf8");

  console.log(`Done: ${outPath}`);
}

run().catch((error) => {
  console.error("Failed to generate notification locales:", error);
  process.exit(1);
});
