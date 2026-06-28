import type { ComponentType } from "react";
import { ModularContentInput } from "./components/ModularContentInput";
import { defineType, defineField, defineArrayMember } from "sanity";

const editorialRichTextBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Titre 2", value: "h2" },
    { title: "Titre 3", value: "h3" },
    { title: "Titre 4", value: "h4" },
    { title: "Citation", value: "blockquote" },
  ],
  lists: [
    { title: "Liste à puces", value: "bullet" },
    { title: "Liste numérotée", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Gras", value: "strong" },
      { title: "Italique", value: "em" },
      { title: "Souligné", value: "underline" },
    ],
    annotations: [
      defineArrayMember({
        name: "link",
        type: "object",
        title: "Lien",
        fields: [
          defineField({
            name: "href",
            title: "URL",
            type: "url",
            validation: (Rule) =>
              Rule.uri({
                scheme: ["http", "https", "mailto", "tel"],
              }),
          }),
          defineField({
            name: "openInNewTab",
            title: "Ouvrir dans un nouvel onglet",
            type: "boolean",
            initialValue: true,
          }),
        ],
      }),
    ],
  },
});

export default defineType({
  name: "editorial",
  title: "Éditorial",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titre interne",
      type: "string",
      description:
        "Ancien champ conservé pour compatibilité. Peut servir de fallback interne.",
    }),
    defineField({
      name: "featured",
      title: "Mettre en avant",
      type: "boolean",
      initialValue: false,
      description: "Ancien champ conservé pour compatibilité.",
    }),
 defineField({
  name: "sortOrder",
  title: "Ordre d’affichage sur le hub éditorial",
  type: "number",
  description:
    "Plus le nombre est petit, plus l’article remonte dans le hub éditorial. Laisser vide pour conserver le tri automatique par date de publication.",
}),
    defineField({
      name: "noIndex",
      title: "Ne pas indexer",
      type: "boolean",
      initialValue: false,
      description: "Ancien champ conservé pour compatibilité SEO.",
    }),

    defineField({
      name: "editorialType",
      title: "Type éditorial",
      type: "string",
      options: {
        list: [
          { title: "Page pilier", value: "pillar" },
          { title: "Article", value: "article" },
          { title: "Page service", value: "servicePage" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
    }),
    defineField({
      name: "targetAudience",
      title: "Cible",
      type: "string",
      options: {
        list: [
          { title: "Vendeur", value: "seller" },
          { title: "Investisseur", value: "investor" },
          { title: "Les deux", value: "both" },
        ],
      },
      initialValue: "both",
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
    }),
    defineField({
      name: "readingTime",
      title: "Temps de lecture (minutes)",
      type: "number",
    }),

    defineField({
      name: "headline",
      title: "Titre principal",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Sur-titre",
      type: "localeString",
    }),
    defineField({
      name: "excerpt",
      title: "Résumé / chapô",
      type: "localeText",
    }),

    defineField({
      name: "mainImage",
      title: "Image principale",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texte alternatif",
          type: "localeString",
        }),
      ],
    }),

    defineField({
      name: "content",
      title: "Contenu",
      description:
        "Rédigez directement dans l’éditeur et utilisez le bouton “Ajouter un bloc” pour insérer un encadré, une citation, ou marquer un passage en pleine largeur.",
      type: "array",
      of: [
        editorialRichTextBlock,
        defineArrayMember({
          name: "layoutBreak",
          title: "Passage en pleine largeur",
          type: "object",
          fields: [
            defineField({
              name: "marker",
              title: "Marker",
              type: "string",
              initialValue: "layoutBreak",
              hidden: true,
              readOnly: true,
            }),
          ],
          preview: {
            prepare() {
              return {
                title: "Passage en pleine largeur",
                subtitle:
                  "Le contenu suivant s’affichera sous la sidebar, sur toute la largeur",
              };
            },
          },
        }),
        defineArrayMember({
          type: "patrimonyFocus",
        }),
        defineArrayMember({
          type: "editorialQuote",
        }),
      ],
      components: {
        input: ModularContentInput as unknown as ComponentType<any>,
      },
      options: {
        disableActions: ["add"],
        insertMenu: {
          views: [{ name: "list" }],
        },
      },
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "ctas",
      title: "Appels à l’action",
      type: "array",
      validation: (Rule) =>
        Rule.max(3).custom((ctas) => {
          if (!Array.isArray(ctas)) return true;

          const placements = ctas
            .map((cta) =>
              cta && typeof cta === "object" && "placement" in cta
                ? String((cta as { placement?: string }).placement || "")
                : ""
            )
            .filter(Boolean);

          const duplicates = placements.filter(
            (placement, index) => placements.indexOf(placement) !== index
          );

          if (duplicates.length > 0) {
            return "Chaque placement CTA doit être unique (sidebar, afterContent, pageEnd).";
          }

          return true;
        }),
      of: [
        defineArrayMember({
          name: "editorialCta",
          title: "CTA éditorial",
          type: "object",
          fields: [
            defineField({
              name: "placement",
              title: "Placement",
              type: "string",
              options: {
                list: [
                  { title: "Sidebar", value: "sidebar" },
                  { title: "Après le contenu", value: "afterContent" },
                  { title: "Fin de page", value: "pageEnd" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              title: "Type de CTA",
              type: "string",
              options: {
                list: [
                  { title: "Contact", value: "contact" },
                  { title: "Estimation", value: "estimation" },
                  { title: "Découverte", value: "discovery" },
                  { title: "Double", value: "dual" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Titre",
              type: "localeString",
            }),
            defineField({
              name: "text",
              title: "Texte",
              type: "localeText",
            }),
            defineField({
              name: "href",
              title: "Lien",
              type: "string",
              description:
                "À utiliser pour les CTA de découverte ou de navigation.",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent =
                    context.parent as { type?: string } | undefined;
                  const ctaType = parent?.type;

                  const trimmed =
                    typeof value === "string" ? value.trim() : "";

                  if (ctaType === "discovery") {
                    if (!trimmed) {
                      return "Le lien est requis pour un CTA de découverte.";
                    }

                    if (
                      trimmed.startsWith("/") ||
                      trimmed.startsWith("http://") ||
                      trimmed.startsWith("https://") ||
                      trimmed.startsWith("mailto:") ||
                      trimmed.startsWith("tel:")
                    ) {
                      return true;
                    }

                    return "Utilise un lien interne commençant par / ou une URL complète.";
                  }

                  if (!trimmed) return true;

                  if (
                    trimmed.startsWith("/") ||
                    trimmed.startsWith("http://") ||
                    trimmed.startsWith("https://") ||
                    trimmed.startsWith("mailto:") ||
                    trimmed.startsWith("tel:")
                  ) {
                    return true;
                  }

                  return "Utilise un lien interne commençant par / ou une URL complète.";
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              placement: "placement",
              type: "type",
            },
            prepare(selection) {
              const { title, placement, type } = selection || {};
              return {
                title: title || "CTA éditorial",
                subtitle: [placement, type].filter(Boolean).join(" • "),
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "sidebarApproach",
      title: "Bloc d’information - Notre approche",
      type: "contentInfoBlock",
      description:
        "Bloc éditorial réutilisable pour présenter une logique d’accompagnement, d’explication ou de contexte.",
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),

    defineField({
      name: "sidebarShowcaseItems",
      title: "Éléments sidebar",
      type: "array",
      of: [
        defineField({
          name: "sidebarShowcaseItem",
          title: "Élément sidebar",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titre",
              type: "localeString",
            }),
            defineField({
              name: "subtitle",
              title: "Sous-titre",
              type: "localeString",
            }),
            defineField({
              name: "href",
              title: "Lien",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Texte alternatif",
                  type: "localeString",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
              media: "image",
            },
          },
        }),
      ],
    }),

    defineField({
      name: "relatedReading",
      title: "Pour prolonger la lecture",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "eyebrow",
          title: "Sur-titre du bloc",
          type: "localeString",
          initialValue: "Pour prolonger la lecture",
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: "title",
          title: "Titre du bloc",
          type: "localeString",
          initialValue: "Quelques pistes pour aller plus loin",
          validation: (Rule) => Rule.max(120),
        }),
        defineField({
          name: "text",
          title: "Texte d’introduction",
          type: "localeText",
          initialValue:
            "Des repères utiles pour clarifier les mécanismes et avancer avec plus de recul.",
          validation: (Rule) => Rule.max(240),
        }),
        defineField({
          name: "links",
          title: "Liens associés",
          type: "array",
          validation: (Rule) => Rule.max(3),
          of: [
            defineArrayMember({
              name: "relatedReadingLink",
              title: "Lien associé",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Titre",
                  type: "localeString",
                  validation: (Rule) => Rule.required().max(120),
                }),
                defineField({
                  name: "href",
                  title: "Lien",
                  type: "string",
                  description:
                    "Exemples : /editorial/mon-article, /contact ou https://...",
                  validation: (Rule) =>
                    Rule.required().custom((value) => {
                      if (
                        typeof value !== "string" ||
                        value.trim().length === 0
                      ) {
                        return "Le lien est requis.";
                      }

                      const trimmed = value.trim();

                      if (
                        trimmed.startsWith("/") ||
                        trimmed.startsWith("http://") ||
                        trimmed.startsWith("https://") ||
                        trimmed.startsWith("mailto:") ||
                        trimmed.startsWith("tel:")
                      ) {
                        return true;
                      }

                      return "Utilise un lien interne commençant par / ou une URL complète.";
                    }),
                }),
                defineField({
                  name: "linkLabel",
                  title: "Libellé du lien",
                  type: "localeString",
                  initialValue: "Lire",
                  validation: (Rule) => Rule.max(40),
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "href",
                },
                prepare(selection) {
                  const { title, subtitle } = selection || {};
                  return {
                    title: title || "Lien associé",
                    subtitle: subtitle || "Lien non renseigné",
                  };
                },
              },
            }),
          ],
        }),
      ],
      preview: {
        select: {
          title: "title",
          links: "links",
        },
        prepare(selection) {
          const { title, links } = selection || {};
          const count = Array.isArray(links) ? links.length : 0;

          return {
            title: "Pour prolonger la lecture",
            subtitle: `${title || "Bloc sans titre"} • ${count} lien${
              count > 1 ? "s" : ""
            }`,
          };
        },
      },
    }),

    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      description:
        "Sources affichées en bas d’article pour renforcer la crédibilité éditoriale.",
      of: [
        defineArrayMember({
          name: "editorialSource",
          title: "Source",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Titre",
              type: "localeString",
              validation: (Rule) => Rule.required().max(160),
            }),
            defineField({
              name: "url",
              title: "Lien",
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https"],
                }),
            }),
            defineField({
              name: "publisher",
              title: "Éditeur / organisme",
              type: "string",
              validation: (Rule) => Rule.max(120),
            }),
            defineField({
              name: "kind",
              title: "Type de source",
              type: "string",
              options: {
                list: [
                  { title: "Rapport", value: "report" },
                  { title: "Étude", value: "study" },
                  { title: "Article", value: "article" },
                  { title: "Statistique", value: "stat" },
                  { title: "Source officielle", value: "official" },
                ],
                layout: "dropdown",
              },
            }),
            defineField({
              name: "note",
              title: "Note",
              type: "localeText",
              validation: (Rule) => Rule.max(280),
            }),
          ],
          preview: {
            select: {
              title: "label",
              publisher: "publisher",
              kind: "kind",
            },
            prepare(selection) {
              const { title, publisher, kind } = selection || {};
              return {
                title: title || "Source",
                subtitle: [publisher, kind].filter(Boolean).join(" • "),
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "localeString",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "localeText",
        }),
      ],
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "headline",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "headline",
      fallbackTitle: "title",
      subtitle: "category",
      media: "mainImage",
    },
    prepare(selection) {
      const { title, fallbackTitle, subtitle, media } = selection || {};
      return {
        title: title || fallbackTitle || "Sans titre",
        subtitle: subtitle || "Éditorial",
        media,
      };
    },
  },
});