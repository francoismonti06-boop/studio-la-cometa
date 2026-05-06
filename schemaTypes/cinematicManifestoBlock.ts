import { defineType, defineField } from "sanity";

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
        defineType({
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Texte",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "emphasis",
              title: "Phrase forte",
              type: "boolean",
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(3).max(10),
    }),
  ],
});