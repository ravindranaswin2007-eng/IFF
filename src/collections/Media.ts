import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: { group: 'Library', description: 'Photographs used across the website. Upload the original high-resolution files; resized versions are created automatically.' },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  upload: {
    mimeTypes: ['image/*'],
    // SVG logos are stored as-is; raster photos get resized copies.
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
    { name: 'alt', type: 'text', required: true, admin: { description: 'Short description of the photo, for screen readers and search engines.' } },
    { name: 'credit', type: 'text' },
  ],
}
