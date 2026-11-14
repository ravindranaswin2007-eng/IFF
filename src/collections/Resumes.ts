import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'

/** Résumés uploaded by job seekers. Private: only signed-in staff can open them. */
export const Resumes: CollectionConfig = {
  slug: 'resumes',
  labels: { singular: 'Résumé', plural: 'Résumés' },
  admin: { group: 'Enquiries', hidden: true, description: 'Résumés open from the job-seeker enquiry they belong to.' },
  access: { read: isLoggedIn, create: () => false, update: isLoggedIn, delete: isLoggedIn },
  upload: { mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
  fields: [{ name: 'candidate', type: 'text' }],
}
