import {defineField, defineType} from 'sanity'
import {pickLocale} from './utils/preview'

export default defineType({
  name: 'legalPage',
  title: 'Mentions légales',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre interne',
      type: 'string',
      initialValue: 'Mentions légales',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Titre affiché',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'localeText',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image du hero',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'localeString',
          validation: (Rule) =>
            Rule.required().warning(
              'Ajoutez une description sobre de l’image pour l’accessibilité.'
            ),
        }),
      ],
    }),
    defineField({
  name: 'content',
  title: 'Contenu',
  type: 'localizedRichText',
  validation: (Rule) => Rule.required(),
}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageTitle',
      media: 'heroImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Mentions légales',
        subtitle: pickLocale(subtitle) || 'Sans titre',
        media,
      }
    },
  },
})
