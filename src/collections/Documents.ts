import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'File', plural: 'Files' },
  admin: { group: 'Library', description: 'Downloadable files such as reports, brochures and audio.' },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  upload: { mimeTypes: ['application/pdf', 'audio/*', 'application/vnd.openxmlformats-officedocument.*', 'application/msword', 'application/vnd.ms-powerpoint'] },
  fields: [{ name: 'title', type: 'text', required: true }],
}
