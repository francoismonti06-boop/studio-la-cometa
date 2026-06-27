import { defineType, defineField } from "sanity";

export default defineType({
  name: "contentInfoBlock",
  title: "Bloc d’information",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Sur-titre",
      type: "localeString",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "localeString",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "localeText",
      validation: (Rule) => Rule.required().max(400),
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
        title: title || "Bloc d’information",
        subtitle: subtitle || "Sans sur-titre",
      };
    },
  },
});