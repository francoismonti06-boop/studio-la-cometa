const { execSync } = require("child_process");
const fs = require("fs");

const FIX = process.argv.includes("--fix");
const BUILD = process.argv.includes("--build");

function run(command) {
  return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function section(title) {
  console.log("\n" + title);
  console.log("─".repeat(title.length));
}

function getChangedSchemaFiles() {
  const out = run("git diff --name-only -- schemaTypes/*.ts").trim();
  return out ? out.split(/\r?\n/) : [];
}

function checkIndent(files) {
  section("Indentation");

  const suspicious = [];
  const pattern = /^ {8,}(defineField\(\{|name:|title:|type:|description:|validation:|initialValue:|\}\),)/;

  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        suspicious.push({ file, lineNumber: index + 1, line });
      }
    });
  }

  if (!suspicious.length) {
    console.log("✓ OK");
    return true;
  }

  for (const item of suspicious) {
    console.log(`✗ ${item.file}:${item.lineNumber}`);
    console.log(`  ${item.line.trim()}`);
  }

  if (FIX) {
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const eol = content.includes("\r\n") ? "\r\n" : "\n";
      const lines = content.split(/\r?\n/);

      const fixed = lines.map((line) => {
        if (!pattern.test(line)) return line;

        const trimmed = line.trimStart();

        if (trimmed.startsWith("defineField({") || trimmed === "}),") {
          return "    " + trimmed;
        }

        return "      " + trimmed;
      });

      fs.writeFileSync(file, fixed.join(eol), "utf8");
    }

    console.log("✓ Correction appliquée");
    return true;
  }

  console.log("→ Relance avec : node tools/guard.js --fix");
  return false;
}

function checkTabs(files) {
  section("Tabulations");

  const hits = [];

  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      if (line.includes("\t")) {
        hits.push({ file, lineNumber: index + 1 });
      }
    });
  }

  if (!hits.length) {
    console.log("✓ Aucune tabulation");
    return true;
  }

  for (const hit of hits) {
    console.log(`✗ ${hit.file}:${hit.lineNumber}`);
  }

  return false;
}

function checkTrailing(files) {
  section("Espaces fin de ligne");

  const hits = [];

  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      if (/[ \t]+$/.test(line)) {
        hits.push({ file, lineNumber: index + 1 });
      }
    });
  }

  if (!hits.length) {
    console.log("✓ OK");
    return true;
  }

  for (const hit of hits) {
    console.log(`✗ ${hit.file}:${hit.lineNumber}`);
  }

  if (FIX) {
    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const eol = content.includes("\r\n") ? "\r\n" : "\n";
      const fixed = content
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]+$/, ""))
        .join(eol);

      fs.writeFileSync(file, fixed, "utf8");
    }

    console.log("✓ Correction appliquée");
    return true;
  }

  console.log("→ Relance avec : node tools/guard.js --fix");
  return false;
}

function checkBuild() {
  if (!BUILD) return true;

  section("Build");

  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✓ Build réussi");
    return true;
  } catch {
    console.log("✗ Build échoué");
    return false;
  }
}

console.log("────────────────────────");
console.log(" COMETA GUARD");
console.log("────────────────────────");

const files = getChangedSchemaFiles();

section("Git diff");

if (!files.length) {
  console.log("✓ Aucun fichier schemaTypes/*.ts modifié");
  process.exit(0);
}

console.log(`✓ ${files.length} fichier(s) modifié(s)`);
files.forEach((file) => console.log(`  - ${file}`));

const results = [
  checkIndent(files),
  checkTabs(files),
  checkTrailing(files),
  checkBuild(),
];

console.log("\n────────────────────────");

if (results.every(Boolean)) {
  console.log("SAFE TO COMMIT");
  process.exit(0);
}

console.log("ATTENTION — contrôle à reprendre");
process.exit(1);