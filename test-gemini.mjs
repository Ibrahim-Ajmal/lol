
import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");

const key = env
  .match(/^GEMINI_API_KEY=(.*)$/m)?.[1]
  ?.trim()
  .replace(/^["']|["']$/g, "");

if (!key) {
  console.log("API key missing!");
  process.exit(1);
}

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models?pageSize=2",
  {
    headers: {
      "x-goog-api-key": key
    }
  }
);

console.log("HTTP STATUS:", response.status);

const data = await response.json();

if (response.ok) {
  console.log("SUCCESS! Gemini accepted the API key.");
  console.log("Available models:", data.models?.map(m => m.name));
} else {
  console.log("GEMINI ERROR:", JSON.stringify(data.error, null, 2));
}
