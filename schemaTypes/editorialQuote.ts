import { defineType, defineField } from "sanity";

export default defineType({
  name: "editorialQuote",
  title: "Citation éditoriale",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Citation",
      type: "localeText",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "author",
      title: "Auteur (optionnel)",
      type: "localeString",
      validation: (Rule) => Rule.max(80),
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      author: "author",
    },
    prepare(selection) {
      const { quote, author } = selection || {};
      return {
        title: quote ? `"${quote}"` : "Citation éditoriale",
        subtitle: author ? `— ${author}` : "Sans auteur",
      };
    },
  },
});