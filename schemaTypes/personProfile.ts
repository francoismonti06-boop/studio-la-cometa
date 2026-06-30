import { defineArrayMember, defineField, defineType } from "sanity"
import {pickLocale} from "./utils/preview"

export default defineType({
  name: "personProfile",
  title: "Profil / Personne",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localeString",
    }),
    defineField({
      name: "headline",
      title: "Titre principal",
      type: "localeString",
      validation: (Rule) => Rule.required(),
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
      options: {hotspot: true},
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
  name: "body",
  title: "Contenu",
  type: "localizedRichText",
  validation: (Rule) => Rule.required(),
}),
    defineField({
      name: "facts",
      title: "Repères sobres",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Libellé",
              type: "localeString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Valeur",
              type: "localeString",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
            prepare({title, subtitle}) {
              return {
                title: pickLocale(title) || "Repère",
                subtitle: pickLocale(subtitle) || "Valeur",
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "methodTitle",
      title: "Titre bloc méthode",
      type: "localeString",
    }),
    defineField({
      name: "methodItems",
      title: "Items méthode",
      type: "array",
      of: [defineArrayMember({type: "localeString"})],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "ctaTitle",
      title: "Titre CTA",
      type: "localeString",
    }),
    defineField({
      name: "ctaText",
      title: "Texte CTA",
      type: "localeText",
    }),
    defineField({
      name: "ctaHref",
      title: "Lien CTA",
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
      title: "No index",
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
    prepare({title, subtitle, media}) {
      return {
        title: title || "Profil / Personne",
        subtitle: pickLocale(subtitle) || "Sans titre affiché",
        media,
      }
    },
  },
})