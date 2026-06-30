const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const ROOT = path.join(process.cwd(), "schemaTypes");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (entry.isFile() && full.endsWith(".ts")) return [full];
    return [];
  });
}

function indentOf(line) {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

function fixFile(file) {
  const original = fs.readFileSync(file, "utf8");
  const lines = original.split(/\r?\n/);
  const out = [];

  const stack = [];
  const changes = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    const defineMatch = line.match(/^(\s*)defineField\(\{/);
    if (defineMatch) {
      stack.push({
        indent: defineMatch[1].length,
        isLocaleField: false,
      });
    }

    const current = stack[stack.length - 1];

    if (
      current &&
      /^\s*type:\s*['"]locale(String|Text)['"],?\s*$/.test(line)
    ) {
      current.isLocaleField = true;
    }

    if (current?.isLocaleField) {
      if (/validation:\s*\(Rule\)\s*=>\s*Rule\.required\(\)\.max\(\d+\),?/.test(line)) {
        const replacement = line.replace(/Rule\.required\(\)\.max\(\d+\)/, "Rule.required()");
        changes.push(`${path.relative(process.cwd(), file)}:${i + 1} required().max() -> required()`);
        line = replacement;
      } else if (/validation:\s*\(Rule\)\s*=>\s*Rule\.max\(\d+\),?/.test(line)) {
        changes.push(`${path.relative(process.cwd(), file)}:${i + 1} remove Rule.max()`);
        continue;
      }
    }

    out.push(line);

    const closeMatch = line.match(/^(\s*)\}\),?/);
    if (closeMatch) {
      const closeIndent = closeMatch[1].length;
      while (stack.length && stack[stack.length - 1].indent >= closeIndent) {
        stack.pop();
      }
    }
  }

  const updated = out.join("\n");

  if (updated !== original && APPLY) {
    fs.writeFileSync(file, updated, "utf8");
  }

  return changes;
}

const files = walk(ROOT);
const allChanges = files.flatMap(fixFile);

console.log(APPLY ? "Mode: apply" : "Mode: dry-run");
console.log(`Fichiers analysés: ${files.length}`);
console.log(`Corrections détectées: ${allChanges.length}`);

for (const change of allChanges) {
  console.log(`- ${change}`);
}

if (!APPLY) {
  console.log("\nDry-run uniquement. Pour appliquer :");
  console.log("node tools\\fixLocaleMaxValidations.js --apply");
}