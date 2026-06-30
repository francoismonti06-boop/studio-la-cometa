// schemaTypes/localized/localizedRichText.ts
import {defineArrayMember, defineField, defineType} from "sanity"

const innerBlocks = [
  defineArrayMember({
    type: "block",
    styles: [
      {title: "Normal", value: "normal"},
      {title: "Titre 2", value: "h2"},
      {title: "Titre 3", value: "h3"},
      {title: "Titre 4", value: "h4"},
      {title: "Citation", value: "blockquote"},
    ],
    lists: [
      {title: "Liste à puces", value: "bullet"},
      {title: "Liste numérotée", value: "number"},
    ],
    marks: {
      decorators: [
        {title: "Gras", value: "strong"},
        {title: "Italique", value: "em"},
        {title: "Souligné", value: "underline"},
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          title: "Lien",
          type: "object",
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
        }),
      ],
    },
  }),
]

export default defineType({
  name: "localizedRichText",
  title: "Texte courant localisé",
  type: "object",
  fields: [
    defineField({
      name: "fr",
      title: "Français",
      type: "array",
      of: innerBlocks,
    }),
    defineField({
      name: "en",
      title: "Anglais",
      type: "array",
      of: innerBlocks,
    }),
  ],
  preview: {
    select: {
      fr: "fr",
      en: "en",
    },
    prepare({fr, en}) {
      const blockFr = Array.isArray(fr)
        ? fr.find((block: any) => block?._type === "block")
        : undefined

      const textFr =
        blockFr?.children?.map((child: any) => child?.text).join("") || ""

      const blockEn = Array.isArray(en)
        ? en.find((block: any) => block?._type === "block")
        : undefined

      const textEn =
        blockEn?.children?.map((child: any) => child?.text).join("") || ""

      return {
        title: textFr || textEn || "Texte vide",
        subtitle: "Texte riche multilingue",
      }
    },
  },
})