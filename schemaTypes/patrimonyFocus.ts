import { defineType, defineField } from "sanity";
import { pickLocale } from "./utils/preview";

export default defineType({
  name: "patrimonyFocus",
  title: "Encadré patrimonial",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "localeString",
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "localeText",
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

      const titleText = pickLocale(title);
      const textText = pickLocale(text);

      const excerpt =
        textText && textText.length > 80
          ? `${textText.slice(0, 80)}…`
          : textText || "Sans texte";

      return {
        title: titleText || "Encadré patrimonial",
        subtitle: excerpt,
      };
    },
  },
});
