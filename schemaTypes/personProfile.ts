import {defineArrayMember, defineField, defineType} from "sanity";

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
      type: "string",
      initialValue: "La Voix du Viager",
    }),
    defineField({
      name: "headline",
      title: "Titre principal",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Chapô",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(420),
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
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            {title: "Normal", value: "normal"},
            {title: "Titre 2", value: "h2"},
            {title: "Titre 3", value: "h3"},
          ],
          lists: [],
          marks: {
            decorators: [
              {title: "Gras", value: "strong"},
              {title: "Italique", value: "em"},
            ],
            annotations: [
              {
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
                ],
              },
            ],
          },
        }),
      ],
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
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Valeur",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "methodTitle",
      title: "Titre bloc méthode",
      type: "string",
      initialValue: "Sa manière d’accompagner",
    }),
    defineField({
      name: "methodItems",
      title: "Items méthode",
      type: "array",
      of: [defineArrayMember({type: "string"})],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "ctaTitle",
      title: "Titre CTA",
      type: "string",
      initialValue: "Présenter une situation patrimoniale",
    }),
    defineField({
      name: "ctaText",
      title: "Texte CTA",
      type: "text",
      rows: 3,
      initialValue:
        "Un échange confidentiel pour examiner ce qui peut être ajusté, transmis ou réorganisé — sans précipitation.",
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
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(170),
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
  },
});