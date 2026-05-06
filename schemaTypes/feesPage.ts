import {defineField, defineType} from 'sanity'

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
      type: 'string',
      initialValue: 'Barème des honoraires',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
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
          type: 'string',
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
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'fee',
              title: 'Honoraires',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'range',
              subtitle: 'fee',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'footerNote',
      title: 'Note de bas de page',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageTitle',
      media: 'heroImage',
    },
  },
})