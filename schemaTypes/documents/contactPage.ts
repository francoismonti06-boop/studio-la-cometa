import {defineField, defineType} from 'sanity'

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
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'excerpt',
      title: 'Chapô',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(220),
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
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre 2', value: 'h2'},
            {title: 'Titre 3', value: 'h3'},
            {title: 'Citation', value: 'blockquote'},
          ],
          lists: [
            {title: 'Puces', value: 'bullet'},
            {title: 'Numérotée', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Lien',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),

    defineField({
      name: 'sidebarIntroTitle',
      title: 'Sidebar — titre du premier bloc',
      type: 'string',
      initialValue: 'Premier échange',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'sidebarIntroItems',
      title: 'Sidebar — textes du premier bloc',
      type: 'array',
      of: [
        defineField({
          name: 'sidebarIntroItem',
          title: 'Texte',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(260),
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'sidebarBenefitsTitle',
      title: 'Sidebar — titre du second bloc',
      type: 'string',
      initialValue: 'Ce que permet cet échange',
      validation: (Rule) => Rule.max(80),
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
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'text',
              title: 'Texte',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(220),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'text',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(170),
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
        subtitle: subtitle || 'Sans titre principal',
        media,
      }
    },
  },
})