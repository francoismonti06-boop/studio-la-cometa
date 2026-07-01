// /schemaTypes/cinematicManifestoBlock.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "cinematicManifestoBlock",
  title: "Cinematic Manifesto",
  type: "object",
  fields: [
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          name: "slide",
          title: "Slide", // 💡 Ajouté pour un affichage propre dans le Studio
          fields: [
            defineField({
              name: "text",
              title: "Texte",
              type: "localeText", // 🌍 Parfait pour la traduction
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "emphasis",
              title: "Phrase forte",
              type: "boolean",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(10),
    }),
  ],
});