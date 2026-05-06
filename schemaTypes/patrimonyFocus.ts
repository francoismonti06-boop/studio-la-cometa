import { defineType, defineField } from "sanity";

export default defineType({
  name: "patrimonyFocus",
  title: "Encadré patrimonial",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required().min(40).max(600),
      description:
        "Un encadré clair et pédagogique. Une idée forte, pas un mini-article.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      text: "text",
    },
    prepare(selection) {
      const { title, text } = selection || {};
      const excerpt =
        typeof text === "string" && text.length > 80
          ? `${text.slice(0, 80)}…`
          : text || "Sans texte";

      return {
        title: title || "Encadré patrimonial",
        subtitle: excerpt,
      };
    },
  },
});