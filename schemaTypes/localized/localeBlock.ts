import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'localeBlock',
  title: 'Texte riche localisé',
  type: 'object',
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
    defineField({
      name: 'en',
      title: 'Anglais',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Texte riche localisé',
      }
    },
  },
})