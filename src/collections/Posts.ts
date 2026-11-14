import type { CollectionConfig } from 'payload'
import { isLoggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'

export const POST_TYPES = [
  { label: 'Blog', value: 'blog' },
  { label: 'Report', value: 'report' },
  { label: 'Podcast', value: 'podcast' },
  { label: 'Webinar', value: 'webinar' },
  { label: 'News', value: 'news' },
] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Knowledge Hub item', plural: 'Knowledge Hub' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', '_status', 'publishedAt'],
    description: 'Blogs, reports, podcasts and webinars shown in the Knowledge Hub. Save as draft to preview, then Publish to put it live.',
    preview: (doc) => `${process.env.SERVER_URL || ''}/knowledge-hub/${doc.slug}`,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  access: { read: publishedOrLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'type', type: 'select', required: true, defaultValue: 'blog', options: [...POST_TYPES], admin: { position: 'sidebar' } },
    slugField(),
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } }, hooks: { beforeChange: [({ value, siblingData }) => value || (siblingData._status === 'published' ? new Date().toISOString() : value)] } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar', description: 'Show on the home page.' } },
    { name: 'excerpt', type: 'textarea', required: true, maxLength: 280, admin: { description: 'One or two sentences shown on cards.' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text' },
        { name: 'authorRole', type: 'text', label: 'Author designation' },
        { name: 'duration', type: 'text', admin: { description: 'e.g. “6 min read” or “45 min”.' } },
      ],
    },
    { name: 'content', type: 'richText' },
    {
      type: 'collapsible',
      label: 'Media & downloads',
      admin: { description: 'For podcasts, webinars and reports.' },
      fields: [
        { name: 'file', type: 'upload', relationTo: 'documents', admin: { description: 'Report PDF or podcast audio file.' } },
        { name: 'embedUrl', type: 'text', label: 'Video / audio link', admin: { description: 'YouTube, Vimeo, Spotify or any public recording link.' } },
      ],
    },
    { name: 'tags', type: 'text', hasMany: true },
  ],
}
