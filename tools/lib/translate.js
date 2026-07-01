// tools/lib/translate.js
import { getSanityClient, assertSanityConfig } from "./sanity.js";
import { askQwen } from "./ollama.js";
import {
  batchTranslationSystemPrompt,
  buildBatchUserPrompt,
  buildUserPrompt,
  seoSystemPrompt,
  translationSystemPrompt,
} from "./prompts.js";
import { cacheKey, loadCache, saveCache } from "./cache.js";

function getArgValue(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

function isLocalizedValue(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (typeof value.fr === "string" || Array.isArray(value.fr)) &&
    (typeof value.en === "string" ||
      Array.isArray(value.en) ||
      value.en === undefined ||
      value.en === null)
  );
}

function seoKind(path) {
  if (path.endsWith("seo.metaTitle")) return "metaTitle";
  if (path.endsWith("seo.metaDescription")) return "metaDescription";
  if (path.endsWith("seoTitle")) return "metaTitle";
  if (path.endsWith("seoDescription")) return "metaDescription";
  return null;
}

function collectLocalizedFields(value, path = []) {
  const fields = [];

  if (!value || typeof value !== "object") return fields;

  if (isLocalizedValue(value)) {
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
  return path.reduce((acc, part) => {
    if (typeof part === "number") {
      return `${acc}[${part}]`;
    }

    if (!acc) {
      return part;
    }

    return `${acc}.${part}`;
  }, "");
}

function pathLabel(path) {
  return path.join(".");
}

function portableTextToPlainText(blocks) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (!Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text || "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

function plainTextToPortableText(text, sourceBlocks) {
  const paragraphs = String(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, index) => {
    const sourceBlock = sourceBlocks?.[index];

    return {
      _key: sourceBlock?._key || `translated-${index}`,
      _type: "block",
      style: sourceBlock?.style || "normal",
      markDefs: sourceBlock?.markDefs || [],
      children: [
        {
          _key: sourceBlock?.children?.[0]?._key || `translated-span-${index}`,
          _type: "span",
          marks: sourceBlock?.children?.[0]?.marks || [],
          text: paragraph,
        },
      ],
    };
  });
}

// 🔹 Modifié : En mode batch on garde la structure si c'est un tableau
function sourceText(field, rawMode = false) {
  if (typeof field.value.fr === "string") {
    return field.value.fr.trim();
  }

  if (Array.isArray(field.value.fr)) {
    if (rawMode) return field.value.fr; // Retourne le tableau JSON brut pour le batch
    return portableTextToPlainText(field.value.fr).trim();
  }

  return "";
}

function hasEnglishValue(field) {
  if (typeof field.value.en === "string") {
    return Boolean(field.value.en.trim());
  }

  if (Array.isArray(field.value.en)) {
    return field.value.en.length > 0;
  }

  return false;
}

function prepareTranslationForPatch(field, translation) {
  // Si la traduction revenue du batch est déjà un tableau JSON, on l'injecte directement
  if (Array.isArray(translation)) {
    return translation;
  }

  if (Array.isArray(field.value.fr) && typeof translation === "string") {
    return plainTextToPortableText(translation, field.value.fr);
  }

  return translation;
}

function shouldTranslate(field) {
  return Boolean(sourceText(field)) && !hasEnglishValue(field);
}

function extractJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");

    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }

    throw new Error("Qwen did not return valid JSON.");
  }
}

function buildBatchPayload(fields) {
  const payload = {};

  for (const field of fields) {
    // 🔹 Utilisation du mode rawMode pour intégrer le PortableText sans destruction
    payload[pathLabel(field.path)] = sourceText(field, true);
  }

  return payload;
}

function cacheKeyForField({ docType, field, mode = "batch" }) {
  const fieldPath = pathLabel(field.path);
  const kind = seoKind(fieldPath);

  return cacheKey({
    type: docType,
    fieldPath,
    text: JSON.stringify(sourceText(field, true)),
    mode: kind ? `seo:${kind}:${mode}` : `translate:${mode}`,
  });
}

function getCachedBatch(fields, docType, cache) {
  const translations = {};
  const missing = [];

  for (const field of fields) {
    const key = cacheKeyForField({ docType, field, mode: "batch" });

    if (cache[key]) {
      translations[pathLabel(field.path)] = cache[key];
    } else {
      missing.push(field);
    }
  }

  return { translations, missing };
}

async function translateDocumentBatch({ docType, fields, cache }) {
  const { translations, missing } = getCachedBatch(fields, docType, cache);

  if (missing.length === 0) {
    return {
      translations,
      source: "cache",
    };
  }

  const payload = buildBatchPayload(missing);

  // Modif du prompt systeme au besoin pour forcer la conservation des structures de blocs
  let systemPrompt = batchTranslationSystemPrompt();
  systemPrompt += `\nATTENTION: If a value is an array of blocks (Sanity PortableText JSON), translate ONLY the "text" properties inside the children spans. Preserve all keys like "_key", "_type", "style", "marks" intact.`;

  const response = await askQwen({
    system: systemPrompt,
    user: buildBatchUserPrompt(payload),
    temperature: 0.1, // Plus bas pour éviter l'invention de clés JSON
  });

  const parsed = extractJson(response);

  for (const field of missing) {
    const label = pathLabel(field.path);
    const value = parsed[label];

    if (!value) {
      throw new Error(`Missing or invalid translation for field: ${label}`);
    }

    translations[label] = value;

    const key = cacheKeyForField({ docType, field, mode: "batch" });
    cache[key] = value;
  }

  return {
    translations,
    source: missing.length === fields.length ? "qwen" : "cache+qwen",
  };
}

async function translateField({ docType, field, cache }) {
  const source = sourceText(field);
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
  const noBatch = args.includes("--no-batch");

  const typeArg = getArgValue(args, "--types");
  const types = typeArg
    ? typeArg
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean)
    : ["contactPage", "methodPage", "personProfile", "propertyIndexPage"];

  const limitArg = getArgValue(args, "--limit");
  const limit = limitArg ? Number(limitArg) : null;

  assertSanityConfig({ write });

  const cache = loadCache();

  console.log("");
  console.log("COMETA AI — translate");
  console.log("Mode:", write ? "write" : "dry-run");
  console.log("Strategy:", noBatch ? "field-by-field" : "batch by document");
  console.log("Types:", types.join(", "));
  console.log("");

  const sanity = getSanityClient({ write });

  const query = `*[_type in $types] | order(_type asc, _updatedAt desc) {
    ...
  }`;

  const docs = await sanity.fetch(query, { types });
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

    if (!noBatch) {
      const { translations, source } = await translateDocumentBatch({
        docType: doc._type,
        fields,
        cache,
      });

      console.log(`SOURCE: ${source}`);
      console.log("");

      for (const field of fields) {
        const fieldPath = pathLabel(field.path);
        const patchPath = `${pathToPatch(field.path)}.en`;
        const translation = translations[fieldPath];

        patchSet[patchPath] = prepareTranslationForPatch(field, translation);
        translatedCount += 1;

        console.log(`FIELD: ${fieldPath}`);
        console.log("FR:");
        console.log(typeof sourceText(field) === "string" ? sourceText(field) : "[Rich Text Blocks]");
        console.log("");
        console.log("EN:");
        console.log(typeof translation === "string" ? translation : "[Translated Rich Text Blocks]");
        console.log("");
      }
    } else {
      for (const field of fields) {
        const fieldPath = pathLabel(field.path);
        const patchPath = `${pathToPatch(field.path)}.en`;

        const { translation, fromCache } = await translateField({
          docType: doc._type,
          field,
          cache,
        });

        patchSet[patchPath] = prepareTranslationForPatch(field, translation);
        translatedCount += 1;

        console.log(`FIELD: ${fieldPath}`);
        console.log(fromCache ? "SOURCE: cache" : "SOURCE: qwen");
        console.log("FR:");
        console.log(sourceText(field));
        console.log("");
        console.log("EN:");
        console.log(translation);
        console.log("");
      }
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