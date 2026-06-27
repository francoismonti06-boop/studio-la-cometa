import type { ComponentType } from "react";
import { ModularContentInput } from "../components/ModularContentInput";
import { defineArrayMember, defineField, defineType } from "sanity";

const methodRichTextBlock = defineArrayMember({
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
                allowRelative: true,
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
  name: "methodPage",
  title: "Page méthode",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      initialValue: "Notre méthode",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "eyebrow",
      title: "Sur-titre de marque",
      type: "localeString",
    }),

    defineField({
      name: "headline",
      title: "Titre principal",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "subtitle",
      title: "Surtitre éditorial",
      type: "localeString",
    }),

    defineField({
      name: "excerpt",
      title: "Chapô",
      type: "localeText",
      validation: (Rule) => Rule.required().max(520),
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
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "readingTime",
      title: "Temps de lecture",
      type: "localeString",
    }),

    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      initialValue: "DECISION",
    }),

    defineField({
      name: "body",
      title: "Contenu principal",
      description:
        "Rédigez directement dans l’éditeur et utilisez le bouton “Ajouter un bloc” pour insérer un encadré, une citation, ou marquer un passage en pleine largeur.",
      type: "array",
      of: [
        methodRichTextBlock,
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
        defineArrayMember({ type: "editorialQuote" }),
        defineArrayMember({ type: "patrimonyFocus" }),
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
      name: "sidebarApproach",
      title: "Bloc d’information sidebar",
      type: "contentInfoBlock",
      description:
        "Bloc éditorial pour présenter une logique d’accompagnement, une précision ou un angle de méthode.",
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),

    defineField({
      name: "sidebarTitle",
      title: "Titre CTA sidebar",
      type: "localeString",
    }),

    defineField({
      name: "sidebarText",
      title: "Texte CTA sidebar",
      type: "localeText",
    }),

    defineField({
      name: "sidebarCtaLabel",
      title: "Libellé bouton sidebar",
      type: "localeString",
      description:
        "Libellé éditorial conservé. Le CTA de sidebar ouvre désormais la modale de contact côté site.",
    }),

    defineField({
      name: "sidebarShowcaseItems",
      title: "Éléments sidebar",
      type: "array",
      description:
        "Liens éditoriaux ou biens à mettre en avant dans la sidebar.",
      of: [
        defineArrayMember({
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
              description:
                "Exemples : /editorial/mon-article, /nos-biens, /property/slug-du-bien, /contact",
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true;
                  if (
                    value.startsWith("/") ||
                    value.startsWith("http://") ||
                    value.startsWith("https://") ||
                    value.startsWith("mailto:") ||
                    value.startsWith("tel:")
                  ) {
                    return true;
                  }
                  return "Utilise un lien interne commençant par / ou une URL complète.";
                }),
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
      name: "bottomCtaTitle",
      title: "Titre CTA fin de page",
      type: "localeString",
    }),

    defineField({
      name: "bottomCtaText",
      title: "Texte CTA fin de page",
      type: "localeText",
    }),

    defineField({
      name: "bottomCtaLabel",
      title: "Libellé bouton fin de page",
      type: "localeString",
    }),

    defineField({
      name: "bottomCtaHref",
      title: "Lien bouton fin de page",
      type: "string",
      initialValue: "/contact",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "localeString",
      validation: (Rule) => Rule.max(70),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localeText",
      validation: (Rule) => Rule.max(170),
    }),

    defineField({
      name: "noIndex",
      title: "Ne pas indexer",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "headline",
      media: "mainImage",
    },
  },
});