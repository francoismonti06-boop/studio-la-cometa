#!/usr/bin/env node

import { runTranslate } from "./lib/translate.js";

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
COMETA AI

Usage:
  node tools/cometa-ai.js translate [options]

Commands:
  translate    Translate Sanity localized fields from fr to en

Options:
  --types      Comma-separated Sanity document types
               Default: contactPage,methodPage,personProfile,propertyIndexPage
  --limit      Limit number of documents processed
  --write      Write translations to Sanity. Default mode is dry-run.

Examples:
  node tools/cometa-ai.js translate --types contactPage --limit 1
  node tools/cometa-ai.js translate --types contactPage --limit 1 --write
`);
}

async function main() {
  if (!command || command === "help" || command === "--help") {
    showHelp();
    return;
  }

  if (command === "translate") {
    await runTranslate(args.slice(1));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error("");
  console.error("ERREUR:");
  console.error(error.message);
  process.exit(1);
});
