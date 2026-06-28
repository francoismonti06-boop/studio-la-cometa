import {defineField, defineType} from 'sanity'

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
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre 2', value: 'h2'},
            {title: 'Titre 3', value: 'h3'},
          ],
          lists: [{title: 'Liste à puces', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
            ],
            annotations: [
              defineField({
                name: 'link',
                title: 'Lien',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              }),
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
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