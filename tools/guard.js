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

console.log("────────────────────────");
console.log(" COMETA GUARD (Line-Driven)");
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
const targetPattern = /defineField|name:|title:|type:|description:|validation:|initialValue:|rows:|options:|\}\),|\},/;
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

    const matchSpaces = line.match(/^(\s*)/);
    const spacesCount = matchSpaces ? matchSpaces[1].length : 0;

    // Critère strict d'anomalie : impair ou exagéré
    if (spacesCount % 2 !== 0 || spacesCount > 16) {
      console.log(`  ✗ ligne ${lineNum} : indentation suspecte (${spacesCount} espaces)`);
      console.log(`      ${line.trim()}`);
      hasAnomalies = true;
      anomaliesToFix[file].push({ lineNum, index, currentSpaces: spacesCount, text: line });
    } else {
      console.log(`  ✓ ligne ${lineNum}`);
    }
  }
}

// Execution du mode --fix ultra-conservateur
if (FIX && hasAnomalies) {
  section("Application du Fix Conservateur");

  for (const [file, anomalies] of Object.entries(anomaliesToFix)) {
    if (!anomalies.length) continue;

    const content = fs.readFileSync(file, "utf8");
    const eol = content.includes("\r\n") ? "\r\n" : "\n";
    const lines = content.split(/\r?\n/);
    const linesToInspect = diffMetadata[file];
    let fileModified = false;

    for (const anomaly of anomalies) {
      let targetSpaces = null;

      // Algorithme de recherche du parent de confiance (hors diff et ouvrant un bloc)
      for (let k = anomaly.index - 1; k >= 0; k--) {
        const lineText = lines[k].trim();
        // La ligne du dessus doit être saine (pas dans le diff) et non vide
        if (!linesToInspect.has(k + 1) && lineText.length > 0) {
          const parentMatch = lines[k].match(/^(\s*)/);
          if (parentMatch) {
            const parentSpaces = parentMatch[1].length;
            // Si le parent finit par [ ou {, on applique l'échelon supérieur (+2)
            targetSpaces = parentSpaces + (/[{\[]$/.test(lineText) ? 2 : 0);
            break;
          }
        }
      }

      // Condition de sécurité absolue : la cible calculée doit être paire et réaliste
      if (targetSpaces !== null && targetSpaces % 2 === 0 && targetSpaces <= 16) {
        console.log(`  ⚡ Ligne ${anomaly.lineNum} corrigée : ${anomaly.currentSpaces} sp ➔ ${targetSpaces} sp`);
        lines[anomaly.index] = " ".repeat(targetSpaces) + anomaly.text.trimStart();
        fileModified = true;
      } else {
        console.log(`  ⏭️ Ligne ${anomaly.lineNum} : SKIPPED (Calcul d'échelon non déterministe ou instable)`);
      }
    }

    if (fileModified) {
      fs.writeFileSync(file, lines.join(eol), "utf8");
    }
  }
  
  console.log("\n⚠️ Des corrections ont été appliquées.");
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