import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'localeString',
  title: 'Texte localisé',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Anglais',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'fr',
      subtitle: 'en',
    },
  },
})