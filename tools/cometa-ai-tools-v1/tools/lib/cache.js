import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "translations.json");

export function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")); } catch { return {}; }
}

export function saveCache(cache) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

export function cacheKey({ type, fieldPath, text, mode = "translate" }) {
  return crypto.createHash("sha256").update(`${mode}::${type}::${fieldPath}::${text}`).digest("hex");
}
