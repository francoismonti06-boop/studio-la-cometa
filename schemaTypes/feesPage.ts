import {defineField, defineType} from 'sanity'
import {pickLocale} from './utils/preview'

export default defineType({
  name: 'feesPage',
  title: 'Barème honoraires',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre interne',
      type: 'string',
      initialValue: 'Barème honoraires',
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
      name: 'rows',
      title: 'Lignes du barème',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feeRow',
          fields: [
            defineField({
              name: 'range',
              title: 'Tranche',
              type: 'localeString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'fee',
              title: 'Honoraires',
              type: 'localeString',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'range',
              subtitle: 'fee',
            },
            prepare({title, subtitle}) {
              return {
                title: pickLocale(title) || 'Tranche',
                subtitle: pickLocale(subtitle) || 'Honoraires',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'footerNote',
      title: 'Note de bas de page',
      type: 'localeText',
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
        title: title || 'Barème honoraires',
        subtitle: pickLocale(subtitle) || 'Sans titre affiché',
        media,
      }
    },
  },
})