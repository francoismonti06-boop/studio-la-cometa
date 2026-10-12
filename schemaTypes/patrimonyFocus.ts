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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Texte",
      type: "localeText",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== "object" || Array.isArray(value)) {
            return "Le texte français est requis.";
          }

          const localized = value as {fr?: unknown; en?: unknown};
          const fr = typeof localized.fr === "string" ? localized.fr : "";
          if (!fr) return "Le texte français est requis.";
          if (fr.length < 40 || fr.length > 600) {
            return "Le texte français doit contenir entre 40 et 600 caractères.";
          }

          const en = typeof localized.en === "string" ? localized.en : "";
          if (en && (en.length < 40 || en.length > 600)) {
            return "Le texte anglais doit contenir entre 40 et 600 caractères.";
          }
          return true;
        }),
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
