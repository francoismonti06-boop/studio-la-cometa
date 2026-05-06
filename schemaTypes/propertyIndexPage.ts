import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'propertyIndexPage',
  title: 'Page hub Adresses',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom interne',
      type: 'string',
      initialValue: 'Hub Adresses',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Titre du hero',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroText',
      title: 'Texte du hero',
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
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Texte d’introduction',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'emptyStateTitle',
      title: 'Titre état vide',
      type: 'string',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Texte état vide',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(180),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroTitle',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Page hub Adresses',
        subtitle: subtitle || 'Sans titre',
      }
    },
  },
})