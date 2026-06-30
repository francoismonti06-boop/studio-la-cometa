// /schemaTypes/homePage.ts

import { defineField, defineType, defineArrayMember } from "sanity";
import { pickLocale } from "./utils/preview";


export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre interne",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "localeString" }),
        defineField({
          name: "title",
          title: "Titre",
          type: "localeString",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "text", title: "Texte", type: "localeText" }),
        defineField({ name: "primaryLabel", title: "Libellé CTA principal", type: "localeString" }),
        defineField({ name: "primaryHref", title: "Lien CTA principal", type: "string" }),
        defineField({ name: "secondaryLabel", title: "Libellé CTA secondaire", type: "localeString" }),
        defineField({ name: "secondaryHref", title: "Lien CTA secondaire", type: "string" }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Texte alternatif", type: "localeString" })],
        }),
      ],
    }),

    defineField({
      name: "manifestoIntro",
      title: "Accroche manifesto",
      type: "localeBlock", // Modifié en localeBlock
      validation: (Rule) => Rule.max(2), // Conserve la validation max lines
    }),

    defineField({
      name: "content",
      title: "Contenu modulaire",
      type: "array",
      validation: (Rule) => Rule.max(10),
      of: [
        { type: "block" },
        defineArrayMember({
          type: "object",
          name: "navigationIntroBlock",
          title: "Introduction des chemins de navigation",
          fields: [
            defineField({ name: "eyebrow", title: "Sur-titre", type: "localeString" }),
            defineField({ name: "title", title: "Titre", type: "localeString", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Texte", type: "localeText", validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "title", subtitle: "eyebrow" },
            prepare({ title, subtitle }) {
              return {
                title: pickLocale(title) || "Introduction des chemins",
                subtitle: pickLocale(subtitle) || "Bloc éditorial",
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "navigationBlock",
          title: "Bloc navigation",
          fields: [
            defineField({ name: "eyebrow", title: "Sur-titre", type: "localeString" }),
            defineField({ name: "title", title: "Titre", type: "localeString", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Texte", type: "localeText" }),
            defineField({ name: "href", title: "Lien", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "linkLabel", title: "Libellé du lien", type: "localeString" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Texte alternatif", type: "localeString" })],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "eyebrow", media: "image" },
            prepare({ title, subtitle, media }) {
              return {
                title: pickLocale(title) || "Bloc navigation",
                subtitle: pickLocale(subtitle),
                media,
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "breakBlock",
          title: "Bloc rupture",
          fields: [
            defineField({ name: "text", title: "Texte", type: "localeText", validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "text" },
            prepare({ title }) {
              return {
                title: "Bloc rupture",
                subtitle: pickLocale(title),
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "ctaBlock",
          title: "Bloc CTA",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Texte", type: "localeText" }),
          ],
          preview: {
            select: { title: "title", subtitle: "text" },
            prepare({ title, subtitle }) {
              return {
                title: pickLocale(title) || "Bloc CTA",
                subtitle: pickLocale(subtitle),
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ 
            name: "metaTitle", 
            title: "Meta title", 
            type: "localeString",
            validation: (Rule) => Rule.custom((value: any) => {
                if (value?.fr && value.fr.length > 60) return 'Le titre doit faire moins de 60 caractères';
                return true;
             }),
        }),
        defineField({ 
            name: "metaDescription", 
            title: "Meta description", 
            type: "localeText",
            validation: (Rule) => Rule.custom((value: any) => {
                if (value?.fr && value.fr.length > 160) return 'La description doit faire moins de 160 caractères';
                return true;
             }),
        }),
        defineField({ name: "noIndex", title: "Ne pas indexer", type: "boolean", initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "hero.title",
      media: "hero.image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Home Page",
        subtitle: pickLocale(subtitle) || "Sans titre Hero",
        media,
      };
    },
  },
});