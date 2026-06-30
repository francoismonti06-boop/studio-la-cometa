// schemaTypes/localized/localizedRichText.ts
import { defineType, defineField, defineArrayMember } from "sanity";

const innerBlocks = [
  defineArrayMember({
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
    },
  })
];

export default defineType({
  name: "localizedRichText",
  title: "Texte Courant Localisé",
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
    prepare({ fr, en }) {
      const blockFr = fr?.find((b: any) => b._type === "block");
      const textFr = blockFr?.children?.map((c: any) => c.text).join("") || "";
      
      const blockEn = en?.find((b: any) => b._type === "block");
      const textEn = blockEn?.children?.map((c: any) => c.text).join("") || "";

      return {
        title: textFr || textEn || "Texte vide",
        subtitle: "Texte riche multilingue",
      };
    },
  },
});