\# Snapshot — Sanity i18n schema complete



Date : 28/06/2026  

Branche : feat/sanity-localized-fields  

Tag : sanity-i18n-schema-complete-2026-06-28



\## État



Migration i18n des schémas Sanity terminée.



Types migrés :

\- string éditorial visible -> localeString

\- text éditorial visible -> localeText

\- image.alt visible -> localeString

\- SEO title/description -> localeString/localeText



\## Garde-fous appliqués



\- Portable Text conservé en statu quo.

\- Champs techniques conservés en string : title interne, slug, href, category, marker, CTA href.

\- initialValue textuelles supprimées sur champs localisés.

\- rows supprimés sur champs localeText.

\- Validation par node tools/guard.js.

\- Build Sanity OK.



\## Dernier état validé



\- node tools/guard.js : SAFE TO COMMIT

\- npm run build : OK

\- audit findstr : restes acceptés



\## Points restant hors sprint



\- Adapter les preview.prepare() aux localeString / localeText.

\- Migrer les contenus existants du dataset Sanity.

\- Vérifier les requêtes GROQ et le front Next.js.

\- Durcir guard.js : détecter untracked, rows sur localeText, initialValue sur localeString/localeText.

