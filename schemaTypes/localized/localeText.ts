import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'localeText',
  title: 'Texte long localisé',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Anglais',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'fr',
      subtitle: 'en',
    },
  },
})