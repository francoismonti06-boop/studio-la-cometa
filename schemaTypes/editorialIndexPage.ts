import {defineField, defineType} from 'sanity'
import {pickLocale} from './utils/preview'

export default defineType({
  name: 'editorialIndexPage',
  title: 'Page hub éditoriale',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom interne',
      type: 'string',
      initialValue: 'Hub éditorial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'localeString',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Titre du hero',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroText',
      title: 'Texte du hero',
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
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Texte d’introduction',
      type: 'localeText',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Titre du bloc d’action',
      type: 'localeString',
    }),
    defineField({
      name: 'ctaText',
      title: 'Texte du bloc d’action',
      type: 'localeText',
    }),
    defineField({
      name: 'emptyStateTitle',
      title: 'Titre état vide',
      type: 'localeString',
    }),
    defineField({
      name: 'emptyStateText',
      title: 'Texte état vide',
      type: 'localeText',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'localeString',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'localeText',
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
        title: title || 'Page hub éditoriale',
        subtitle: pickLocale(subtitle) || 'Sans titre',
      }
    },
  },
})
