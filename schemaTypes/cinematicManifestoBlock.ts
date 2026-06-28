import {defineField, defineType} from "sanity";

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
        defineField({
          name: "slide",
          title: "Slide",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Texte",
              type: "localeText",
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