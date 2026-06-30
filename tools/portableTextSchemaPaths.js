/**
 * Champs PortableText à convertir de :
 *
 *   type: "array"
 *
 * vers :
 *
 *   type: "localeBlock"
 *
 * Le script migratePortableTextSchemas.js utilisera cette configuration.
 */

module.exports = {
  "schemaTypes/property.ts": [
    "introText",
    "description",
  ],

  "schemaTypes/editorial.ts": [
    "content",
  ],

  "schemaTypes/documents/methodPage.ts": [
    "body",
  ],

  "schemaTypes/homePage.ts": [
    "manifestoIntro",
  ],
}