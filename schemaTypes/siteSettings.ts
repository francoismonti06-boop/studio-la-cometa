import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom interne',
      type: 'string',
      initialValue: 'Paramètres globaux',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
          name: 'navigation',
          title: 'Navigation principale',
          type: 'array',
          validation: (Rule) => Rule.max(7),
          of: [
            {
              type: 'object',
              name: 'navItem',
              fields: [
                defineField({
                name: 'label',
                title: 'Libellé',
                type: 'localeString',
              validation: (Rule) => Rule.required(),
                }),
                defineField({
                name: 'href',
                title: 'Lien',
                type: 'string',
                description:
                    'Exemples : /, /editorial, /nos-biens, /contact',
                validation: (Rule) =>
                    Rule.required().custom((value) => {
                      if (!value) return 'Le lien est obligatoire'
                      if (!value.startsWith('/')) {
                        return 'Le lien doit commencer par /'
                      }
                      return true
                }),
                }),
              ],
              preview: {
                select: {
                title: 'label',
                subtitle: 'href',
                },
              },
            },
          ],
        }),

    defineField({
      name: 'contactName',
      title: 'Nom du contact',
      type: 'string',
      initialValue: 'Marie-Laure Delalande',
      validation: (Rule) => Rule.max(80),
    }),

    defineField({
          name: 'contactRole',
          title: 'Fonction / rôle',
          type: 'localeString',
          initialValue: 'Conseil en viager & nue-propriété',
        }),

    defineField({
      name: 'contactBrand',
      title: 'Marque affichée',
      type: 'string',
      initialValue: 'La Voix du Viager',
      validation: (Rule) => Rule.max(80),
    }),

    defineField({
          name: 'contactImage',
          title: 'Photo du contact',
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
  ],
  preview: {
    select: {
      title: 'title',
      media: 'contactImage',
    },
    prepare({title, media}) {
      return {
        title: title || 'Paramètres du site',
        media,
      }
    },
  },
})