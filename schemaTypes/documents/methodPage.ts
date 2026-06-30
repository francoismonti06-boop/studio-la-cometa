import type { ComponentType } from "react";
import { ModularContentInput } from "../components/ModularContentInput";
import { defineArrayMember, defineField, defineType } from "sanity";
import { pickLocale } from "../utils/preview";

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
      validation: (Rule) => Rule.required(),
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
      type: "array",
      of: [
        defineArrayMember({ type: "localizedRichText" }), // 🔹 ICI : Remplacement par le texte riche localisé
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
                subtitle: "Le contenu suivant s’affichera sous la sidebar, sur toute la largeur",
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
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "sidebarApproach",
      title: "Bloc d’information sidebar",
      type: "contentInfoBlock",
      options: { collapsible: true, collapsed: false },
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
    }),

    defineField({
      name: "sidebarShowcaseItems",
      title: "Éléments sidebar",
      type: "array",
      of: [
        defineArrayMember({
          name: "sidebarShowcaseItem",
          title: "Élément sidebar",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString" }),
            defineField({ name: "subtitle", title: "Sous-titre", type: "localeString" }),
            defineField({ name: "href", title: "Lien", type: "string" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Texte alternatif", type: "localeString" }],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image" },
            prepare({ title, subtitle, media }) {
              return {
                title: pickLocale(title) || "Sans titre",
                subtitle: pickLocale(subtitle) || "Sans sous-titre",
                media,
              };
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
    }),

    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localeText",
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
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Page méthode",
        subtitle: pickLocale(subtitle) || "Sans titre principal",
        media,
      };
    },
  },
});