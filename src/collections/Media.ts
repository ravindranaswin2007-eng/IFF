import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

/** "IFF-summit_2025 (1).jpg" → "IFF summit 2025" */
const fromFilename = (filename?: string | null) =>
  (filename ?? '').replace(/\.[a-z0-9]+$/i, '').replace(/\(\d+\)/g, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() || 'IFF photo'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photo library' },
  admin: {
    group: 'Library',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description: 'All photos used on the website. Upload the original photo (JPG, PNG or WebP); smaller copies for fast loading are made automatically.',
  },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: 320, position: 'centre' },
      { name: 'card', width: 960, height: 640, position: 'centre' },
      { name: 'wide', width: 1920, height: undefined },
      { name: 'xl', width: 2880, height: undefined },
    ],
    adminThumbnail: 'thumb',
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
  fields: [
    {
      name: 'alt',
      label: 'Description (optional)',
      type: 'text',
      admin: { description: 'A few words describing the photo, e.g. “Members at the Mumbai roundtable”. Filled in from the file name if left empty.' },
      hooks: { beforeValidate: [({ value, data }) => (value && String(value).trim()) || fromFilename(data?.filename)] },
    },
  ],
}
