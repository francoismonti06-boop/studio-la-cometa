// tools/lib/gitDiff.js
const { execSync } = require("child_process");

function run(command) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return "";
  }
}

function getModifiedLines() {
  const rawDiff =
    run("git diff -U0 -- schemaTypes/**/*.ts schemaTypes/*.ts") +
    "\n" +
    run("git diff -U0 --staged -- schemaTypes/**/*.ts schemaTypes/*.ts");

  const metadata = {};
  const fileBlocks = rawDiff.split("diff --git");

  for (const block of fileBlocks) {
    if (!block.includes("schemaTypes/")) continue;

    const fileMatch = block.match(/b\/(schemaTypes\/[^\s]+\.ts)/);
    if (!fileMatch) continue;

    const filePath = fileMatch[1];

    if (!metadata[filePath]) {
      metadata[filePath] = new Set();
    }

    const chunkMatches = block.matchAll(/@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/g);

    for (const match of chunkMatches) {
      const startLine = Number.parseInt(match[1], 10);
      const lineCount = match[2] ? Number.parseInt(match[2], 10) : 1;

      for (let offset = 0; offset < lineCount; offset += 1) {
        metadata[filePath].add(startLine + offset);
      }
    }
  }

  return metadata;
}

module.exports = { getModifiedLines };