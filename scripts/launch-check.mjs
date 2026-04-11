import fs from "fs";
import path from "path";

const requiredKeys = [
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY"
];

const recommendedKeys = [
  "GEMINI_API_KEY",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_PRIVATE_KEY",
  "ARCJET_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER"
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'")))
    {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const envPath = path.resolve(process.cwd(), ".env");
const envLocalPath = path.resolve(process.cwd(), ".env.local");
loadEnvFile(envPath);
loadEnvFile(envLocalPath);

function printList(title, keys) {
  console.log(`\n${title}`);
  keys.forEach((key) => console.log(`- ${key}`));
}

const missingRequired = requiredKeys.filter((key) => !process.env[key]);
const missingRecommended = recommendedKeys.filter((key) => !process.env[key]);

console.log("Launch readiness check");
console.log(`Time: ${new Date().toISOString()}`);

if (missingRequired.length === 0) {
  console.log("\nRequired env: OK");
} else {
  printList("Required env missing:", missingRequired);
}

if (missingRecommended.length === 0) {
  console.log("\nRecommended env: OK");
} else {
  printList("Recommended env missing:", missingRecommended);
}

if (missingRequired.length > 0) {
  process.exitCode = 1;
}