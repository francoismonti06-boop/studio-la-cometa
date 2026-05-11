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
      name: 'soldHighlightsEyebrow',
      title: 'Sur-titre de la section — situations vendues',
      type: 'string',
      initialValue: 'Situations vendues',
    }),
    defineField({
      name: 'soldHighlightsTitle',
      title: 'Titre de la section — situations vendues',
      type: 'string',
      initialValue: 'Des arbitrages devenus concrets',
    }),
    defineField({
      name: 'soldHighlights',
      title: 'Cartes — situations vendues',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        defineField({
          name: 'soldHighlight',
          title: 'Situation vendue',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Photo',
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
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'status',
              title: 'Statut',
              type: 'string',
              initialValue: 'Vendu',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
  name: 'operationType',
  title: 'Type d’opération',
  type: 'string',
  description:
    'Ex. Viager occupé, Vente libre comptant, Vente libre comptant & Viager occupé…',
  validation: (Rule) => Rule.required().max(120),
}),
            defineField({
              name: 'title',
              title: 'Titre éditorial',
              type: 'string',
              description: 'Ex. 3 étapes — 3 transactions',
              validation: (Rule) => Rule.required().max(90),
            }),
            defineField({
              name: 'propertyType',
              title: 'Type de bien',
              type: 'string',
              description: 'Ex. Chalet, villa, appartement, maison familiale…',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'location',
              title: 'Localisation',
              type: 'string',
              description: 'Ex. Praz-sur-Arly, Saint-Tropez, Paris…',
            }),
            defineField({
              name: 'story',
              title: 'Petite histoire',
              type: 'text',
              rows: 12,
              description:
                'Récit éditorial de la situation : contexte, évolution du projet, décision prise, effet patrimonial. Le texte peut être développé, mais doit rester lisible dans une carte.',
              validation: (Rule) => Rule.required().max(2200),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'operationType',
              media: 'image',
              propertyType: 'propertyType',
              location: 'location',
              status: 'status',
            },
            prepare({title, subtitle, media, propertyType, location, status}) {
              return {
                title: title || 'Situation vendue',
                subtitle: [status, subtitle, propertyType, location].filter(Boolean).join(' · '),
                media,
              }
            },
          },
        }),
      ],
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