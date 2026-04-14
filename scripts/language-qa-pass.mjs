import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MESSAGES } from "../lib/i18n/translations.js";
import { SUPPORTED_LOCALES } from "../lib/i18n/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "language-qa-report.json");

const sections = ["notifications", "emails"];
const base = MESSAGES.en;

const extractPlaceholders = (value) => {
  const set = new Set();
  for (const match of String(value).matchAll(/\{([a-zA-Z0-9_]+)\}/g)) {
    set.add(match[1]);
  }
  return [...set].sort();
};

const artifactRegexes = [
  /\[\d+\]/g,
  /@@PH_/g,
  /__PH_/g,
  /\{\s*\{/g,
  /\}\s*\}/g,
  /\{[^}]*\[[^}]*\}/g
];

const qaReport = {};

for (const locale of SUPPORTED_LOCALES) {
  if (locale === "en") continue;

  const localeReport = {
    missingSections: [],
    missingKeys: {},
    extraKeys: {},
    placeholderMismatches: [],
    artifactHits: [],
    likelyUntranslated: [],
    qaFlags: []
  };

  for (const section of sections) {
    const baseDict = base?.[section] || {};
    const localeDict = MESSAGES?.[locale]?.[section];

    if (!localeDict) {
      localeReport.missingSections.push(section);
      continue;
    }

    const baseKeys = Object.keys(baseDict);
    const localeKeys = Object.keys(localeDict);

    const missing = baseKeys.filter((key) => !(key in localeDict));
    const extra = localeKeys.filter((key) => !(key in baseDict));

    if (missing.length) localeReport.missingKeys[section] = missing;
    if (extra.length) localeReport.extraKeys[section] = extra;

    for (const key of baseKeys) {
      if (!(key in localeDict)) continue;

      const baseValue = String(baseDict[key]);
      const localeValue = String(localeDict[key]);

      const expectedPlaceholders = extractPlaceholders(baseValue);
      const actualPlaceholders = extractPlaceholders(localeValue);

      if (expectedPlaceholders.join("|") !== actualPlaceholders.join("|")) {
        localeReport.placeholderMismatches.push({
          section,
          key,
          expected: expectedPlaceholders,
          actual: actualPlaceholders,
          baseValue,
          localeValue
        });
      }

      for (const regex of artifactRegexes) {
        if (regex.test(localeValue)) {
          localeReport.artifactHits.push({ section, key, value: localeValue });
          break;
        }
      }

      const textNoTokens = localeValue
        .replace(/\{[^}]+\}/g, "")
        .replace(/[0-9₹|%.,:!()\-"' ]/g, "");

      const asciiCount = (textNoTokens.match(/[A-Za-z]/g) || []).length;
      const nonAsciiCount = (textNoTokens.match(/[^\x00-\x7F]/g) || []).length;
      const totalLetters = asciiCount + nonAsciiCount;

      if (totalLetters >= 12 && asciiCount / totalLetters > 0.85) {
        localeReport.likelyUntranslated.push({ section, key, value: localeValue });
      }

      if (/(\blogged in\b|\blog in\b)/i.test(localeValue) && key === "transactionSuccessCompact") {
        localeReport.qaFlags.push({
          section,
          key,
          issue: "Potentially ambiguous translation of 'logged in' phrase.",
          value: localeValue
        });
      }
    }
  }

  qaReport[locale] = localeReport;
}

const summary = {};
for (const [locale, report] of Object.entries(qaReport)) {
  summary[locale] = {
    missingSections: report.missingSections.length,
    missingKeys: Object.values(report.missingKeys).reduce((acc, arr) => acc + arr.length, 0),
    extraKeys: Object.values(report.extraKeys).reduce((acc, arr) => acc + arr.length, 0),
    placeholderMismatches: report.placeholderMismatches.length,
    artifactHits: report.artifactHits.length,
    likelyUntranslated: report.likelyUntranslated.length,
    qaFlags: report.qaFlags.length
  };
}

fs.writeFileSync(outputPath, JSON.stringify({ summary, qaReport }, null, 2), "utf8");

for (const [locale, localeSummary] of Object.entries(summary)) {
  console.log(`${locale}: ${JSON.stringify(localeSummary)}`);
}

console.log(`\nSaved report: ${outputPath}`);
