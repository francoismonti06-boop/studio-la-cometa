// /schemas/homePage.ts

export default {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre interne",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        {
          name: "eyebrow",
          title: "Sur-titre",
          type: "localeString",
        },
        {
          name: "title",
          title: "Titre",
          type: "localeString",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Texte",
          type: "localeText",
          rows: 4,
        },
        {
          name: "primaryLabel",
          title: "Libellé CTA principal",
          type: "localeString",
        },
        {
          name: "primaryHref",
          title: "Lien CTA principal",
          type: "string",
        },
        {
          name: "secondaryLabel",
          title: "Libellé CTA secondaire",
          type: "localeString",
        },
        {
          name: "secondaryHref",
          title: "Lien CTA secondaire",
          type: "string",
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texte alternatif",
              type: "string",
            },
          ],
        },
      ],
    },

    {
      name: "manifestoIntro",
      title: "Accroche manifesto",
      type: "array",
      description:
        "Texte affiché sous le breadcrumb, avant le manifesto animé. Deux lignes maximum. Créer une tension éditoriale, éviter les phrases génériques.",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule: any) => Rule.max(2),
    },

    {
      name: "content",
      title: "Contenu modulaire",
      type: "array",
      validation: (Rule: any) => Rule.max(10),
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre 2", value: "h2" },
            { title: "Titre 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Lien",
                type: "object",
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },

        {
          type: "object",
          name: "navigationIntroBlock",
          title: "Introduction des chemins de navigation",
          fields: [
            {
              name: "eyebrow",
              title: "Sur-titre",
              type: "localeString",
            },
            {
              name: "title",
              title: "Titre",
              type: "localeString",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "text",
              title: "Texte",
              type: "localeText",
              rows: 4,
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
            },
            prepare(selection: any) {
              return {
                title: selection.title || "Introduction des chemins",
                subtitle:
                  selection.subtitle ||
                  "Bloc éditorial avant les cartes de navigation",
              };
            },
          },
        },

        {
          type: "object",
          name: "navigationBlock",
          title: "Bloc navigation",
          fields: [
            {
              name: "eyebrow",
              title: "Sur-titre",
              type: "string",
            },
            {
              name: "title",
              title: "Titre",
              type: "localeString",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "text",
              title: "Texte",
              type: "localeText",
              rows: 4,
            },
            {
              name: "href",
              title: "Lien",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "linkLabel",
              title: "Libellé du lien",
              type: "localeString",
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  title: "Texte alternatif",
                  type: "localeString",
                },
              ],
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "eyebrow",
              media: "image",
            },
          },
        },

        {
          type: "object",
          name: "breakBlock",
          title: "Bloc rupture",
          fields: [
            {
              name: "text",
              title: "Texte",
              type: "localeText",
              rows: 3,
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: "text",
            },
            prepare(selection: any) {
              return {
                title: "Bloc rupture",
                subtitle: selection.title,
              };
            },
          },
        },

        {
          type: "object",
          name: "ctaBlock",
          title: "Bloc CTA",
          fields: [
            {
              name: "title",
              title: "Titre",
              type: "localeString",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "text",
              title: "Texte",
              type: "localeText",
              rows: 4,
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "text",
            },
          },
        },
      ],
    },

    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta title",
          type: "localeString",
          validation: (Rule: any) => Rule.max(60),
        },
        {
          name: "metaDescription",
          title: "Meta description",
          type: "localeText",
          rows: 3,
          validation: (Rule: any) => Rule.max(160),
        },
        {
          name: "noIndex",
          title: "Ne pas indexer",
          type: "boolean",
          initialValue: false,
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "hero.title",
      media: "hero.image",
    },
  },
};