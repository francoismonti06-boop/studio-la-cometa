import { sanity, assertSanityConfig } from "./sanity.js";
import { askQwen } from "./ollama.js";
import { buildUserPrompt, seoSystemPrompt, translationSystemPrompt } from "./prompts.js";
import { cacheKey, loadCache, saveCache } from "./cache.js";

function getArgValue(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

function isLocalizedString(value) {
  return value && typeof value === "object" && !Array.isArray(value) &&
    typeof value.fr === "string" &&
    (typeof value.en === "string" || value.en === undefined || value.en === null);
}

function seoKind(path) {
  if (path.endsWith("seo.metaTitle")) return "metaTitle";
  if (path.endsWith("seo.metaDescription")) return "metaDescription";
  return null;
}

function collectLocalizedFields(value, path = []) {
  const fields = [];
  if (!value || typeof value !== "object") return fields;

  if (isLocalizedString(value)) {
    fields.push({ path, value });
    return fields;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      fields.push(...collectLocalizedFields(value[index], [...path, index]));
    }
    return fields;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith("_")) continue;
    fields.push(...collectLocalizedFields(child, [...path, key]));
  }

  return fields;
}

function pathToPatch(path) {
  return path.map((part) => typeof part === "number" ? `[${part}]` : part).join(".");
}

function pathLabel(path) {
  return path.join(".");
}

function shouldTranslate(field) {
  const fr = field.value?.fr?.trim();
  const en = field.value?.en?.trim();
  return Boolean(fr) && !en;
}

async function translateField({ docType, field, cache }) {
  const source = field.value.fr.trim();
  const fieldPath = pathLabel(field.path);
  const kind = seoKind(fieldPath);

  const key = cacheKey({
    type: docType,
    fieldPath,
    text: source,
    mode: kind ? `seo:${kind}` : "translate",
  });

  if (cache[key]) return { translation: cache[key], fromCache: true };

  const system = kind ? seoSystemPrompt(kind) : translationSystemPrompt();
  const translation = await askQwen({
    system,
    user: buildUserPrompt(source),
    temperature: kind ? 0.25 : 0.2,
  });

  cache[key] = translation;
  return { translation, fromCache: false };
}

export async function runTranslate(args) {
  const write = args.includes("--write");
  const typeArg = getArgValue(args, "--types");
  const types = typeArg ? typeArg.split(",").map((type) => type.trim()).filter(Boolean)
    : ["contactPage", "methodPage", "personProfile", "propertyIndexPage"];
  const limitArg = getArgValue(args, "--limit");
  const limit = limitArg ? Number(limitArg) : null;

  assertSanityConfig({ write });
  const cache = loadCache();

  console.log("");
  console.log("COMETA AI — translate");
  console.log("Mode:", write ? "write" : "dry-run");
  console.log("Types:", types.join(", "));
  console.log("");

  const docs = await sanity.fetch(`*[_type in $types] | order(_type asc, _updatedAt desc) { ... }`, { types });
  const selectedDocs = limit ? docs.slice(0, limit) : docs;

  console.log(`Documents trouvés: ${docs.length}`);
  console.log(`Documents traités: ${selectedDocs.length}`);
  console.log("");

  let translatedCount = 0;
  let skippedDocs = 0;

  for (const doc of selectedDocs) {
    const fields = collectLocalizedFields(doc).filter(shouldTranslate);
    if (fields.length === 0) {
      skippedDocs += 1;
      continue;
    }

    console.log("────────────────────────────────────────");
    console.log(`Document: ${doc._type} / ${doc._id}`);
    console.log(`Champs à traduire: ${fields.length}`);
    console.log("");

    const patchSet = {};

    for (const field of fields) {
      const fieldPath = pathLabel(field.path);
      const patchPath = `${pathToPatch(field.path)}.en`;
      const { translation, fromCache } = await translateField({ docType: doc._type, field, cache });

      patchSet[patchPath] = translation;
      translatedCount += 1;

      console.log(`FIELD: ${fieldPath}`);
      console.log(fromCache ? "SOURCE: cache" : "SOURCE: qwen");
      console.log("FR:");
      console.log(field.value.fr.trim());
      console.log("");
      console.log("EN:");
      console.log(translation);
      console.log("");
    }

    if (write) {
      await sanity.patch(doc._id).set(patchSet).commit();
      console.log("WRITE: OK");
    } else {
      console.log("WRITE: NO");
    }
    console.log("");
  }

  saveCache(cache);

  console.log("────────────────────────────────────────");
  console.log("Terminé.");
  console.log(`Champs traduits: ${translatedCount}`);
  console.log(`Documents sans traduction à faire: ${skippedDocs}`);
  console.log("");
}
