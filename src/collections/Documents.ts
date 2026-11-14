import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'File', plural: 'File library' },
  admin: { group: 'Library', useAsTitle: 'title', description: 'Downloadable files such as report PDFs, the partnership brochure and podcast audio.' },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  upload: { mimeTypes: ['application/pdf', 'audio/*', 'application/vnd.openxmlformats-officedocument.*', 'application/msword', 'application/vnd.ms-powerpoint'] },
  fields: [{ name: 'title', type: 'text', required: true }],
}
