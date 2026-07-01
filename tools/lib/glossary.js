import { businessTerms, mandatoryTerms, styleGuide } from "./glossary-data.js";

function renderMandatoryTerms() {
  return Object.entries(mandatoryTerms)
    .map(([fr, en]) => `- "${fr}" MUST be translated as "${en}".`)
    .join("\n");
}

function renderBusinessTerms() {
  return Object.entries(businessTerms)
    .map(([fr, config]) => {
      const note = config.note ? ` Note: ${config.note}` : "";
      return `- "${fr}" → "${config.translation}".${note}`;
    })
    .join("\n");
}

function renderStyleGuide() {
  return `
Style guide:
- English: ${styleGuide.english}
- Tone: ${styleGuide.tone}
- Avoid: ${styleGuide.avoid.join(", ")}
- Prefer: ${styleGuide.prefer.join(", ")}
`.trim();
}

export function renderGlossary() {
  return `
MANDATORY TRANSLATIONS:
These translations are compulsory. Do not paraphrase them when the French source exactly matches.

${renderMandatoryTerms()}

BUSINESS TERMINOLOGY:
${renderBusinessTerms()}

${renderStyleGuide()}
`.trim();
}

export const glossary = renderGlossary();