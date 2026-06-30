import {defineField, defineType} from 'sanity'
import {pickLocale} from '../utils/preview'

export default defineType({
  name: 'contactPage',
  title: 'Page Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom interne',
      type: 'string',
      initialValue: 'Page Contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Titre principal',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Chapô',
      type: 'localeText',
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
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
  name: 'body',
  title: 'Contenu',
  type: 'localizedRichText',
}),
    defineField({
      name: 'sidebarIntroTitle',
      title: 'Sidebar — titre du premier bloc',
      type: 'localeString',
    }),
    defineField({
      name: 'sidebarIntroItems',
      title: 'Sidebar — textes du premier bloc',
      type: 'array',
      of: [
        defineField({
          name: 'sidebarIntroItem',
          title: 'Texte',
          type: 'localeText',
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'sidebarBenefitsTitle',
      title: 'Sidebar — titre du second bloc',
      type: 'localeString',
    }),
    defineField({
      name: 'sidebarBenefits',
      title: 'Sidebar — bénéfices',
      type: 'array',
      of: [
        defineField({
          name: 'sidebarBenefit',
          title: 'Bénéfice',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Titre',
              type: 'localeString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'localeText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'text',
            },
            prepare({title, subtitle}) {
              return {
                title: pickLocale(title) || 'Sans titre',
                subtitle: pickLocale(subtitle) || 'Sans texte',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'localeString',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'localeText',
    }),
    defineField({
      name: 'noIndex',
      title: 'Masquer des moteurs (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'headline',
      media: 'mainImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Page Contact',
        subtitle: pickLocale(subtitle) || 'Sans titre principal',
        media,
      }
    },
  },
})