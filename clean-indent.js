const { execSync } = require("child_process");
const fs = require("fs");

const DRY_RUN = process.argv.includes("--check");
const FIX = process.argv.includes("--fix");

if (!DRY_RUN && !FIX) {
  console.log("Usage:");
  console.log("  node clean-indent.js --check");
  console.log("  node clean-indent.js --fix");
  process.exit(1);
}

const diff = execSync("git diff -U0 -- schemaTypes/*.ts", {
  encoding: "utf8",
});

if (!diff.trim()) {
  console.log("OK — aucun diff non indexé dans schemaTypes/*.ts");
  process.exit(0);
}

const files = new Map();
let currentFile = null;

for (const line of diff.split(/\r?\n/)) {
  const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
  if (fileMatch) {
    currentFile = fileMatch[1];
    if (!currentFile.startsWith("schemaTypes/") || !currentFile.endsWith(".ts")) {
      currentFile = null;
    } else if (!files.has(currentFile)) {
      files.set(currentFile, new Set());
    }
    continue;
  }

  const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
  if (hunkMatch && currentFile) {
    const start = Number(hunkMatch[1]);
    const count = Number(hunkMatch[2] || 1);

    for (let i = 0; i < count; i++) {
      files.get(currentFile).add(start + i);
    }
  }
}

const suspiciousPattern =
  /^ {8,}(defineField\(\{|name:|title:|type:|description:|validation:|initialValue:|\}\),)/;

let total = 0;

for (const [file, lineNumbers] of files.entries()) {
  const content = fs.readFileSync(file, "utf8");
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  const lines = content.split(/\r?\n/);
  let changed = false;

  for (const lineNumber of lineNumbers) {
    const index = lineNumber - 1;
    const line = lines[index];

    if (!line) continue;
    if (!suspiciousPattern.test(line)) continue;

    const trimmed = line.trimStart();
    let replacement = line;

    if (trimmed.startsWith("defineField({") || trimmed === "}),") {
      replacement = "    " + trimmed;
    } else {
      replacement = "      " + trimmed;
    }

    if (replacement !== line) {
      total++;
      console.log(`${FIX ? "FIX" : "CHECK"} ${file}:${lineNumber}`);
      console.log(`- ${line}`);
      console.log(`+ ${replacement}`);

      if (FIX) {
        lines[index] = replacement;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, lines.join(eol), "utf8");
  }
}

if (total === 0) {
  console.log("OK — aucune indentation suspecte détectée.");
} else if (DRY_RUN) {
  console.log(`\n${total} ligne(s) suspecte(s). Lance : node clean-indent.js --fix`);
} else {
  console.log(`\n${total} ligne(s) corrigée(s). Vérifie avec : git diff -- schemaTypes`);
}