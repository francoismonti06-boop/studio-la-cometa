import { defineType, defineField } from "sanity";
import { pickLocale } from "./utils/preview";

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
      const quoteText = pickLocale(quote);
      const authorText = pickLocale(author);
      return {
        title: quoteText ? `"${quoteText}"` : "Citation éditoriale",
        subtitle: authorText ? `— ${authorText}` : "Sans auteur",
      };
    },
  },
});