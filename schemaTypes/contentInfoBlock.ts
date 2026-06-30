import { defineType, defineField } from "sanity";
import { pickLocale } from "./utils/preview";

export default defineType({
  name: "contentInfoBlock",
  title: "Bloc d’information",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Sur-titre",
      type: "localeString",
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "localeText",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eyebrow",
    },
    prepare(selection) {
      const { title, subtitle } = selection || {};
      return {
        title: pickLocale(title) || "Bloc d’information",
        subtitle: pickLocale(subtitle) || "Sans sur-titre",
      };
    },
  },
});