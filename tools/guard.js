// tools/guard.js
const fs = require("fs");
const { execSync } = require("child_process");
const { getModifiedLines } = require("./lib/gitDiff");

const FIX = process.argv.includes("--fix");

function run(command) {
  try {
    execSync(command, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function section(title) {
  console.log("\n" + title);
  console.log("─".repeat(title.length));
}

function isWorkingTreeClean() {
  return run("git diff --quiet") && run("git diff --cached --quiet");
}

function getIndentCount(line) {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function getPreviousNonEmptyIndex(lines, index) {
  for (let k = index - 1; k >= 0; k--) {
    if (lines[k].trim().length > 0) {
      return k;
    }
  }
  return null;
}

function computeExpectedIndentFromSyntax(lines, index) {
  const previousIndex = getPreviousNonEmptyIndex(lines, index);
  if (previousIndex === null) return null;

  const previousLine = lines[previousIndex];
  const previousText = previousLine.trim();
  const previousSpaces = getIndentCount(previousLine);

  if (/[{\[(]$/.test(previousText)) {
    return previousSpaces + 2;
  }

  return previousSpaces;
}

function findPrepareStart(lines, index) {
  for (let k = index; k >= 0; k--) {
    const trimmed = lines[k].trim();

    if (/^prepare\s*\(/.test(trimmed)) {
      return k;
    }

    if (
      k < index &&
      (/^\s*preview\s*:/.test(lines[k]) ||
        /^\s*select\s*:/.test(lines[k]) ||
        /^\s*fields\s*:/.test(lines[k]) ||
        /^\s*defineField\s*\(/.test(lines[k]) ||
        /^\s*defineType\s*\(/.test(lines[k]))
    ) {
      break;
    }
  }

  return null;
}

function countBraceDelta(line) {
  let delta = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (const char of line) {
    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "'" && !inDouble && !inTemplate) {
      inSingle = !inSingle;
      continue;
    }

    if (char === '"' && !inSingle && !inTemplate) {
      inDouble = !inDouble;
      continue;
    }

    if (char === "`" && !inSingle && !inDouble) {
      inTemplate = !inTemplate;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (char === "{") delta += 1;
    if (char === "}") delta -= 1;
  }

  return delta;
}

function findPrepareEnd(lines, start) {
  let depth = 0;
  let seenOpeningBrace = false;

  for (let k = start; k < lines.length; k++) {
    const line = lines[k];
    
    // Utilisation du helper pour éviter de compter les accolades dans les strings
    const delta = countBraceDelta(line);

    if (delta > 0) seenOpeningBrace = true;
    depth += delta;

    if (seenOpeningBrace && depth === 0 && k > start) {
      return k;
    }

    if (seenOpeningBrace && depth < 0) {
      return null;
    }
  }

  return null;
}

function detectPrepareLineRole(trimmed, insideReturnObject) {
  if (!trimmed) return "empty";

  if (/^prepare\s*\(/.test(trimmed)) return "prepare";
  if (/^(const|let|var)\s+/.test(trimmed)) return "local";
  if (/^return\s*\{/.test(trimmed)) return "return-open";

  if (trimmed === "}" || trimmed === "},") {
    return insideReturnObject ? "return-close" : "prepare-close";
  }

  if (insideReturnObject) return "return-field";

  if (/^\/\//.test(trimmed)) return "local";
  if (/^\/\*/.test(trimmed) || /^\*/.test(trimmed) || /^\*\//.test(trimmed)) return "local";

  return "unknown";
}

function fixPrepareBlockIndent(sourceLines, outputLines, start, end) {
  const baseIndent = getIndentCount(sourceLines[start]);

  if (baseIndent % 2 !== 0 || baseIndent < 0 || baseIndent > 12) {
    return {
      changed: false,
      skipped: true,
      reason: `ancre prepare instable (${baseIndent} espaces)`,
    };
  }

  let insideReturnObject = false;
  let changed = false;

  for (let idx = start; idx <= end; idx++) {
    const trimmed = sourceLines[idx].trim();
    const role = detectPrepareLineRole(trimmed, insideReturnObject);

    if (role === "unknown") {
      return {
        changed: false,
        skipped: true,
        reason: `ligne ${idx + 1} non reconnue dans prepare: ${trimmed}`,
      };
    }

    let targetSpaces = baseIndent;

    if (role === "prepare") {
      targetSpaces = baseIndent;
    } else if (role === "local" || role === "return-open") {
      targetSpaces = baseIndent + 2;
    } else if (role === "return-field") {
      targetSpaces = baseIndent + 4;
    } else if (role === "return-close") {
      targetSpaces = baseIndent + 2;
    } else if (role === "prepare-close") {
      targetSpaces = baseIndent;
    } else if (role === "empty") {
      outputLines[idx] = "";
      continue;
    }

    const proposedLine = " ".repeat(targetSpaces) + trimmed;
    
    // On s'assure qu'on modifie bien la ligne avant de flagger `changed = true`
    if (outputLines[idx] !== proposedLine) {
      outputLines[idx] = proposedLine;
      changed = true;
    }

    if (role === "return-open") {
      insideReturnObject = true;
    } else if (role === "return-close") {
      insideReturnObject = false;
    }
  }

  return {
    changed,
    skipped: false,
    reason: null,
    baseIndent,
  };
}

console.log("────────────────────────");
console.log(" COMETA GUARD (Block-Driven)");
console.log("────────────────────────");

const diffMetadata = getModifiedLines();
const modifiedFiles = Object.keys(diffMetadata);

if (!modifiedFiles.length) {
  section("Analyse Git Diff");
  console.log("✓ Aucun fichier schemaTypes/*.ts modifié dans le diff actuel.");

  section("Analyse terminée");
  console.log("Étape suivante recommandée :");
  console.log("    git diff");

  if (isWorkingTreeClean()) {
    console.log("\n✨ SAFE TO COMMIT");
  } else {
    console.log("\nℹ️ Aucun schéma Sanity modifié, mais le dépôt contient encore des changements.");
  }

  process.exit(0);
}

section("Fichiers schemaTypes détectés dans le diff");
modifiedFiles.forEach((file) => console.log(`  - ${file}`));

let hasAnomalies = false;
const targetPattern =
  /defineField|preview:|select:|prepare\(|return\s*\{|name:|title:|subtitle:|type:|description:|validation:|initialValue:|rows:|options:|\}\),|\},/;

const anomaliesToFix = {};

section("Contrôle indentation — lignes modifiées uniquement");

for (const [file, linesToInspect] of Object.entries(diffMetadata)) {
  if (!fs.existsSync(file)) {
    console.log(`\n⚠️ ${file} introuvable, ignoré.`);
    continue;
  }

  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  console.log(`\n${file}`);
  anomaliesToFix[file] = [];

  for (const lineNum of linesToInspect) {
    const index = lineNum - 1;
    if (index < 0 || index >= lines.length) continue;

    const line = lines[index];
    if (!targetPattern.test(line)) continue;

    const spacesCount = getIndentCount(line);
    const expectedSpaces = computeExpectedIndentFromSyntax(lines, index);

    const hasBasicIndentAnomaly = spacesCount % 2 !== 0 || spacesCount > 16;
    const hasSyntaxIndentAnomaly =
      expectedSpaces !== null &&
      expectedSpaces % 2 === 0 &&
      expectedSpaces <= 16 &&
      spacesCount !== expectedSpaces;

    if (hasBasicIndentAnomaly || hasSyntaxIndentAnomaly) {
      const expectedLabel =
        expectedSpaces !== null ? `, attendu ${expectedSpaces}` : "";

      console.log(
        `  ✗ ligne ${lineNum} : indentation suspecte (${spacesCount} espaces${expectedLabel})`
      );
      console.log(`      ${line.trim()}`);
      hasAnomalies = true;
      anomaliesToFix[file].push({
        lineNum,
        index,
        currentSpaces: spacesCount,
        expectedSpaces,
        text: line,
      });
    } else {
      console.log(`  ✓ ligne ${lineNum}`);
    }
  }
}

// Execution du mode --fix par bloc prepare
if (FIX && hasAnomalies) {
  section("Application du Fix par Bloc Structurel");

  for (const [file, anomalies] of Object.entries(anomaliesToFix)) {
    if (!anomalies.length) continue;

    const content = fs.readFileSync(file, "utf8");
    const eol = content.includes("\r\n") ? "\r\n" : "\n";
    const sourceLines = content.split(/\r?\n/);
    const outputLines = [...sourceLines];
    const processedBlocks = new Set();

    let fileModified = false;

    for (const anomaly of anomalies) {
      const prepareStart = findPrepareStart(sourceLines, anomaly.index);

      if (prepareStart === null) {
        console.log(
          `  ⏭️ Ligne ${anomaly.lineNum} : SKIPPED (aucun bloc prepare détecté)`
        );
        continue;
      }

      if (processedBlocks.has(prepareStart)) {
        continue;
      }

      const prepareEnd = findPrepareEnd(sourceLines, prepareStart);

      if (prepareEnd === null) {
        console.log(
          `  ⏭️ Ligne ${anomaly.lineNum} : SKIPPED (fin du bloc prepare introuvable)`
        );
        continue;
      }

      processedBlocks.add(prepareStart);

      const result = fixPrepareBlockIndent(
        sourceLines,
        outputLines,
        prepareStart,
        prepareEnd
      );

      if (result.skipped) {
        console.log(
          `  ⏭️ Bloc prepare lignes ${prepareStart + 1}-${prepareEnd + 1} : SKIPPED (${result.reason})`
        );
        continue;
      }

      if (result.changed) {
        console.log(
          `  📦 Bloc prepare lignes ${prepareStart + 1}-${prepareEnd + 1} réaligné sur ${result.baseIndent} sp`
        );
        fileModified = true;
      }
    }

    if (fileModified) {
      fs.writeFileSync(file, outputLines.join(eol), "utf8");
    }
  }

  console.log("\n⚠️ Des corrections structurelles ont été appliquées.");
  console.log("Relance sans --fix pour valider le nouveau diff.");
}

section("Analyse terminée");
console.log("Étape suivante recommandée :");
console.log("    git diff");

if (hasAnomalies && !FIX) {
  console.log("\n🚨 ATTENTION — anomalie(s) détectée(s).");
  process.exit(1);
}

process.exit(0);