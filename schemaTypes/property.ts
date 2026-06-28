import {defineArrayMember, defineField, defineType} from 'sanity'

const isViager = (document: {transactionType?: string} | undefined) =>
  document?.transactionType === 'viager'

export default defineType({
  name: 'property',
  title: 'Bien immobilier',
  type: 'document',
  groups: [
    {name: 'editorial', title: 'Éditorial'},
    {name: 'listing', title: 'Carte hub'},
    {name: 'sidebar', title: 'Sidebar fiche'},
    {name: 'business', title: 'Informations bien'},
    {name: 'media', title: 'Médias'},
    {name: 'technical', title: 'Technique / énergie'},
    {name: 'internal', title: 'Interne'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre interne',
      type: 'string',
      group: 'internal',
      validation: (Rule) => Rule.required(),
      description: 'Titre interne du document. Sert aussi de fallback.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'internal',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
   defineField({
  name: 'highlightOnHomepage',
  title: 'Mettre en avant sur la page d’accueil',
  type: 'boolean',
  group: 'internal',
  initialValue: false,
}),

defineField({
  name: 'hubSortOrder',
  title: 'Ordre sur le hub Adresses',
  type: 'number',
  group: 'listing',
  description:
    'Plus le nombre est petit, plus le bien remonte haut sur la page Adresses. Exemple : 1, 2, 3. Laisser vide pour afficher après les biens ordonnés.',
  validation: (Rule) => Rule.min(0),
}),

    defineField({
          name: 'marketingTitle',
          title: 'Titre marketing affiché',
          type: 'localeString',
          group: 'editorial',
          description: 'Titre affiché sur la page. Si vide, le site utilisera le titre interne.',
        }),
    defineField({
          name: 'excerpt',
          title: 'Résumé court',
          type: 'localeText',
          group: 'editorial',
          description: 'Résumé éditorial court pour listing ou mise en avant.',
        }),

    defineField({
      name: 'listingCard',
      title: 'Carte du hub Adresses',
      type: 'object',
      group: 'listing',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
                name: 'eyebrow',
                title: 'Sur-titre de carte',
                type: 'localeString',
                description: 'Petit texte au-dessus du titre sur la carte.',
                validation: (Rule) => Rule.max(80),
              }),
        defineField({
                name: 'title',
                title: 'Titre de carte',
                type: 'localeString',
                description: 'Titre éditorial affiché sur la carte du hub.',
                validation: (Rule) => Rule.max(120),
              }),
        defineField({
                name: 'excerpt',
                title: 'Résumé de carte',
                type: 'localeText',
                description: 'Résumé court orienté situation patrimoniale.',
                validation: (Rule) => Rule.max(220),
              }),
        defineField({
                name: 'ctaLabel',
                title: 'Libellé CTA',
                type: 'localeString',
                validation: (Rule) => Rule.max(40),
              }),
        defineField({
                name: 'statusLabel',
                title: 'Label statut',
                type: 'localeString',
                description: 'Ex. Adresse confidentielle, Viager occupé, Nue-propriété.',
                validation: (Rule) => Rule.max(50),
              }),
      ],
    }),

    defineField({
          name: 'heroExcerpt',
          title: 'Accroche du hero',
          type: 'localeText',
          group: 'editorial',
          description: 'Texte court sous le titre du hero.',
        }),

    defineField({
      name: 'introEyebrow',
      title: 'Intro — sur-titre',
      type: 'string',
      group: 'editorial',
      description: 'Exemple : Résidence d’exception',
    }),
    defineField({
      name: 'introTitle',
      title: 'Intro — titre éditorial',
      type: 'string',
      group: 'editorial',
    }),
    defineField({
      name: 'introText',
      title: 'Intro — texte court',
      type: 'array',
      group: 'editorial',
      description:
        'Bloc d’introduction sous le hero avec mise en forme légère : paragraphes, gras, italique, souligné, listes et liens.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [
            {title: 'Liste à puces', value: 'bullet'},
            {title: 'Liste numérotée', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
              {title: 'Souligné', value: 'underline'},
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
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description longue',
      type: 'array',
      group: 'editorial',
      description:
        'Texte principal de la fiche bien avec mise en forme simple : paragraphes, intertitres, gras, italique, souligné, listes et liens.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre 2', value: 'h2'},
            {title: 'Titre 3', value: 'h3'},
            {title: 'Titre 4', value: 'h4'},
            {title: 'Citation', value: 'blockquote'},
          ],
          lists: [
            {title: 'Liste à puces', value: 'bullet'},
            {title: 'Liste numérotée', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
              {title: 'Souligné', value: 'underline'},
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
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),

    defineField({
      name: 'sidebarBlocks',
      title: 'Blocs de sidebar',
      type: 'array',
      group: 'sidebar',
      description:
        'Blocs éditoriaux affichés dans la colonne droite de la fiche bien, au-dessus du bloc de contact.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sidebarInfoBlock',
          title: 'Bloc information',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Surtitre',
              type: 'localeString',
              validation: (Rule) => Rule.max(80),
              }),
              defineField({
              name: 'title',
              title: 'Titre',
              type: 'localeString',
              validation: (Rule) => Rule.max(120),
              }),
              defineField({
              name: 'text',
              title: 'Texte',
              type: 'localeText',
              validation: (Rule) => Rule.max(500),
              }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'eyebrow',
            },
            prepare(selection) {
              return {
                title: selection.title || 'Bloc information',
                subtitle: selection.subtitle || 'Sidebar',
              }
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'sidebarKeyPointsBlock',
          title: 'Points clés',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Surtitre',
              type: 'localeString',
              validation: (Rule) => Rule.max(80),
              }),
              defineField({
              name: 'title',
              title: 'Titre',
              type: 'localeString',
              validation: (Rule) => Rule.max(120),
              }),
              defineField({
              name: 'items',
              title: 'Points',
              type: 'array',
              of: [{type: 'localeString'}],
              validation: (Rule) => Rule.max(6),
              }),
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items',
            },
            prepare(selection) {
              const count = Array.isArray(selection.items) ? selection.items.length : 0

              return {
                title: selection.title || 'Points clés',
                subtitle: `${count} point${count > 1 ? 's' : ''}`,
              }
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'sidebarQuoteBlock',
          title: 'Bloc citation',
          fields: [
            defineField({
              name: 'text',
              title: 'Citation',
              type: 'localeText',
              validation: (Rule) => Rule.max(320),
              }),
              defineField({
              name: 'caption',
              title: 'Signature / précision',
              type: 'localeString',
              validation: (Rule) => Rule.max(100),
              }),
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'caption',
            },
            prepare(selection) {
              return {
                title: selection.title || 'Citation',
                subtitle: selection.subtitle || 'Sidebar',
              }
            },
          },
        }),

        defineArrayMember({
          type: 'object',
          name: 'sidebarRelatedPropertyBlock',
          title: 'Situation associée',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Surtitre',
              type: 'localeString',
              validation: (Rule) => Rule.max(80),
              }),
              defineField({
              name: 'title',
              title: 'Titre',
              type: 'localeString',
              validation: (Rule) => Rule.required().max(120),
              }),
              defineField({
              name: 'text',
              title: 'Texte',
              type: 'localeText',
              validation: (Rule) => Rule.max(260),
              }),
              defineField({
              name: 'ctaLabel',
              title: 'Libellé du lien',
              type: 'localeString',
              validation: (Rule) => Rule.max(50),
              }),
            defineField({
              name: 'href',
              title: 'Lien',
              type: 'string',
              description: 'Exemple : /property/domaine-confidentiel-saint-tropez',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                name: 'alt',
                title: 'Texte alternatif',
                type: 'localeString',
                description: 'Description courte de l’image pour l’accessibilité.',
                validation: (Rule) => Rule.max(140),
              }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'eyebrow',
              media: 'image',
            },
            prepare(selection) {
              return {
                title: selection.title || 'Situation associée',
                subtitle: selection.subtitle || 'Sidebar',
                media: selection.media,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'editorial',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          description: 'Titre SEO affiché dans les moteurs de recherche.',
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          description: 'Description SEO affichée dans les moteurs de recherche.',
          validation: (Rule) => Rule.max(180),
        }),
      ],
    }),

    defineField({
      name: 'mainImage',
      title: 'Image principale (hero)',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      description: 'Image principale affichée dans le hero de la fiche bien.',
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie médias',
      type: 'array',
      group: 'media',
      description:
        'Galerie complète du bien. L’ordre d’apparition se gère par glisser-déposer. Un média peut être marqué comme principal pour occuper le grand format.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
        defineArrayMember({
          type: 'object',
          name: 'mediaItem',
          title: 'Média',
          fields: [
            defineField({
              name: 'type',
              title: 'Type de média',
              type: 'string',
              options: {
                list: [
                  {title: 'Image', value: 'image'},
                  {title: 'Vidéo (YouTube)', value: 'video'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              hidden: ({parent}) => (parent as {type?: string} | undefined)?.type !== 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {type?: string} | undefined
                  if (parent?.type === 'image' && !value) {
                    return 'Une image est requise pour un média de type image.'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'videoUrl',
              title: 'URL vidéo YouTube',
              type: 'url',
              hidden: ({parent}) => (parent as {type?: string} | undefined)?.type !== 'video',
              description: 'Colle ici une URL YouTube complète.',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {type?: string} | undefined
                  if (parent?.type === 'video' && !value) {
                    return 'Une URL YouTube est requise pour un média de type vidéo.'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'featured',
              title: 'Média principal',
              type: 'boolean',
              initialValue: false,
              description: 'Affiché en grand dans la galerie sur la page du bien.',
            }),
            defineField({
              name: 'alt',
              title: 'Texte alternatif',
              type: 'localeString',
              description: 'Description courte du média pour l’accessibilité.',
              }),
          ],
          preview: {
            select: {
              type: 'type',
              media: 'image',
              title: 'alt',
              featured: 'featured',
              videoUrl: 'videoUrl',
            },
            prepare(selection: any) {
              const {type, media, title, featured, videoUrl} = selection || {}

              const baseTitle = title || (type === 'video' ? 'Vidéo YouTube' : 'Image')

              const subtitleParts = [
                type === 'video' ? 'Vidéo' : 'Image',
                featured ? 'Principal' : null,
                type === 'video' && videoUrl ? videoUrl : null,
              ].filter(Boolean)

              return {
                title: baseTitle,
                subtitle: subtitleParts.join(' • '),
                media,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'propertyType',
      title: 'Type de bien',
      type: 'string',
      group: 'business',
      options: {
        list: [
          {title: 'Villa', value: 'villa'},
          {title: 'Maison', value: 'maison'},
          {title: 'Appartement', value: 'appartement'},
          {title: 'Propriété', value: 'propriete'},
          {title: 'Hôtel particulier', value: 'hotel_particulier'},
          {title: 'Domaine', value: 'domaine'},
          {title: 'Chalet', value: 'chalet'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'transactionType',
      title: 'Type de transaction',
      type: 'string',
      group: 'business',
      options: {
        list: [
          {title: 'Viager', value: 'viager'},
          {title: 'Nue-propriété', value: 'nuePropriete'},
          {title: 'Vente classique', value: 'venteClassique'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'viagerOccupationType',
      title: 'Mode de viager',
      type: 'string',
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      options: {
        list: [
          {title: 'Occupé', value: 'occupe'},
          {title: 'Libre', value: 'libre'},
        ],
        layout: 'radio',
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as {transactionType?: string} | undefined
          if (isViager(document) && !value) {
            return 'Le mode de viager est obligatoire lorsque le type de transaction est "Viager".'
          }
          return true
        }),
    }),
    defineField({
      name: 'saleFormula',
      title: 'Formule de vente',
      type: 'string',
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      options: {
        list: [
          {title: 'Bouquet sans rente', value: 'bouquetSansRente'},
          {title: 'Bouquet avec rente', value: 'bouquetAvecRente'},
          {title: 'Rente sans bouquet', value: 'renteSansBouquet'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as {transactionType?: string} | undefined
          if (isViager(document) && !value) {
            return 'La formule de vente est obligatoire lorsque le type de transaction est "Viager".'
          }
          return true
        }),
    }),
    defineField({
      name: 'saleFormulaNote',
      title: 'Note sur la formule / DUH',
      type: 'text',
      rows: 4,
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      description:
        'Précisions libres sur la mécanique financière, le DUH, les options de durée ou les variantes de prix.',
    }),
    defineField({
      name: 'status',
      title: 'Statut du bien',
      type: 'string',
      group: 'business',
      options: {
        list: [
          {title: 'Disponible', value: 'available'},
          {title: 'Sous offre', value: 'underOffer'},
          {title: 'Sous compromis', value: 'underCompromise'},
          {title: 'Vendu', value: 'sold'},
          {title: 'Vendue', value: 'soldFemale'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'location',
      title: 'Localisation',
      type: 'string',
      group: 'business',
    }),
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'number',
      group: 'business',
      description: 'Prix affiché en euros.',
    }),
    defineField({
      name: 'marketValue',
      title: 'Valeur libre',
      type: 'number',
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      description: 'Valeur libre du bien en euros.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (typeof value === 'number' && value >= 0) return true
          return 'La valeur libre doit être un nombre positif ou nul.'
        }),
    }),
    defineField({
      name: 'occupiedValue',
      title: 'Valeur occupée',
      type: 'number',
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      description: 'Valeur occupée du bien en euros.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (typeof value === 'number' && value >= 0) return true
          return 'La valeur occupée doit être un nombre positif ou nul.'
        }),
    }),
    defineField({
      name: 'duhDurationYears',
      title: 'Durée DUH principale (années)',
      type: 'number',
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      description: 'Durée principale du droit d’usage et d’habitation.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return true
          return 'La durée DUH principale doit être un nombre entier supérieur ou égal à 1.'
        }),
    }),
    defineField({
      name: 'duhOptionalDurationYears',
      title: 'Durée DUH optionnelle (années)',
      type: 'number',
      group: 'business',
      hidden: ({document}) => !isViager(document as {transactionType?: string} | undefined),
      description: 'Durée optionnelle éventuelle du droit d’usage et d’habitation.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return true
          return 'La durée DUH optionnelle doit être un nombre entier supérieur ou égal à 1.'
        }),
    }),
    defineField({
      name: 'livingSurface',
      title: 'Surface habitable (m²)',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'landSurface',
      title: 'Surface terrain (m²)',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'rooms',
      title: 'Pièces',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Chambres',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Salles de bain',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'wcCount',
      title: 'WC',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'floors',
      title: 'Niveaux',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'yearBuilt',
      title: 'Année de construction',
      type: 'number',
      group: 'business',
    }),
    defineField({
      name: 'priceAndRisks',
      title: 'Bloc prix & Géorisques',
      type: 'object',
      group: 'business',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'priceHeading',
          title: 'Titre bloc prix',
          type: 'string',
          initialValue: 'À propos du prix',
        }),
        defineField({
          name: 'priceLabel',
          title: 'Libellé du prix',
          type: 'string',
          initialValue: 'Prix',
        }),
        defineField({
          name: 'agencyFeesNote',
          title: 'Mention honoraires',
          type: 'text',
          rows: 3,
          initialValue:
            "Les honoraires d'agence seront intégralement à la charge du vendeur.",
          description: 'Texte affiché sous le prix dans la fiche bien.',
        }),
        defineField({
          name: 'georisquesHeading',
          title: 'Titre bloc Géorisques',
          type: 'string',
          initialValue: 'Géorisques',
        }),
        defineField({
          name: 'georisquesText',
          title: 'Texte Géorisques',
          type: 'text',
          rows: 4,
          initialValue:
            'Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques',
        }),
        defineField({
          name: 'georisquesUrl',
          title: 'URL Géorisques',
          type: 'url',
          initialValue: 'https://www.georisques.gouv.fr',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),
      ],
    }),

    defineField({
      name: 'dpeRating',
      title: 'DPE',
      type: 'string',
      group: 'technical',
      options: {
        list: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'gesRating',
      title: 'GES',
      type: 'string',
      group: 'technical',
      options: {
        list: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'energyConsumption',
      title: 'Consommation énergétique (kWh/m²/an)',
      type: 'number',
      group: 'technical',
      description: 'Valeur chiffrée affichée sous la classe DPE.',
    }),
    defineField({
      name: 'greenhouseGasEmission',
      title: 'Émission GES (kg CO₂/m²/an)',
      type: 'number',
      group: 'technical',
      description: 'Valeur chiffrée affichée sous la classe GES.',
    }),
    defineField({
      name: 'energyAuditPeriod',
      title: 'Période de diagnostic énergie',
      type: 'string',
      group: 'technical',
      options: {
        list: [
          {title: 'Avant le 1er juillet 2021', value: 'before2021-07-01'},
          {title: 'Après le 1er juillet 2021', value: 'after2021-07-01'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'heatingType',
      title: 'Type de chauffage',
      type: 'string',
      group: 'technical',
      options: {
        list: [
          {title: 'Aérothermie', value: 'aerotherme'},
          {title: 'Gaz', value: 'gaz'},
          {title: 'Électrique', value: 'electrique'},
          {title: 'Fioul', value: 'fioul'},
          {title: 'Bois', value: 'bois'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'energyDiagnosisDate',
      title: 'Date du diagnostic énergétique',
      type: 'date',
      group: 'technical',
      description: 'Date de réalisation du DPE.',
    }),
    defineField({
      name: 'estimatedAnnualEnergyCostMin',
      title: 'Coût annuel estimé min (€)',
      type: 'number',
      group: 'technical',
      description: 'Montant minimum estimé des dépenses annuelles d’énergie.',
    }),
    defineField({
      name: 'estimatedAnnualEnergyCostMax',
      title: 'Coût annuel estimé max (€)',
      type: 'number',
      group: 'technical',
      description: 'Montant maximum estimé des dépenses annuelles d’énergie.',
    }),
    defineField({
      name: 'energyPriceReferenceText',
      title: 'Texte de référence prix énergie',
      type: 'string',
      group: 'technical',
      initialValue: 'Prix moyens des énergies indexés au 1er janvier 2021 (abonnement compris)',
      description:
        'Texte réglementaire affiché sous l’estimation annuelle. Modifiable si besoin.',
    }),

    defineField({
      name: 'features',
      title: 'Caractéristiques',
      type: 'array',
      group: 'business',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          title: 'Caractéristique',
          fields: [
            defineField({
              name: 'label',
              title: 'Libellé',
              type: 'localeString',
              validation: (Rule) => Rule.required(),
              }),
            defineField({
              name: 'featured',
              title: 'Mettre en avant',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'featured',
            },
            prepare(selection) {
              const {title, subtitle} = selection as {
                title?: string
                subtitle?: boolean
              }

              return {
                title: title || 'Caractéristique',
                subtitle: subtitle ? 'Mise en avant' : 'Standard',
              }
            },
          },
        }),
      ],
      description:
        'Équipements et prestations du bien. La logique de catégories n’est plus utilisée en front.',
    }),
  ],

  preview: {
    select: {
      title: 'marketingTitle',
      fallbackTitle: 'title',
      media: 'mainImage',
      status: 'status',
      propertyType: 'propertyType',
      transactionType: 'transactionType',
      viagerOccupationType: 'viagerOccupationType',
      saleFormula: 'saleFormula',
      location: 'location',
    },
    prepare(selection: any) {
      const {
        title,
        fallbackTitle,
        media,
        status,
        propertyType,
        transactionType,
        viagerOccupationType,
        saleFormula,
        location,
      } = selection || {}

      const statusMap: Record<string, string> = {
        available: 'Disponible',
        underOffer: 'Sous offre',
        underCompromise: 'Sous compromis',
        sold: 'Vendu',
        soldFemale: 'Vendue',
      }

      const propertyTypeMap: Record<string, string> = {
        villa: 'Villa',
        maison: 'Maison',
        appartement: 'Appartement',
        propriete: 'Propriété',
        hotel_particulier: 'Hôtel particulier',
        domaine: 'Domaine',
        chalet: 'Chalet',
      }

      const transactionTypeMap: Record<string, string> = {
        viager: 'Viager',
        nuePropriete: 'Nue-propriété',
        venteClassique: 'Vente classique',
      }

      const viagerOccupationTypeMap: Record<string, string> = {
        occupe: 'Occupé',
        libre: 'Libre',
      }

      const saleFormulaMap: Record<string, string> = {
        bouquetSansRente: 'Bouquet sans rente',
        bouquetAvecRente: 'Bouquet avec rente',
        renteSansBouquet: 'Rente sans bouquet',
      }

      const parts = [
        propertyType ? propertyTypeMap[propertyType] || propertyType : null,
        transactionType ? transactionTypeMap[transactionType] || transactionType : null,
        viagerOccupationType
          ? viagerOccupationTypeMap[viagerOccupationType] || viagerOccupationType
          : null,
        saleFormula ? saleFormulaMap[saleFormula] || saleFormula : null,
        status ? statusMap[status] || status : null,
        location || null,
      ].filter(Boolean)

      return {
        title: title || fallbackTitle || 'Sans titre',
        subtitle: parts.join(' • '),
        media,
      }
    },
  },
})