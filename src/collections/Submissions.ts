import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn } from '../access'

export const SUBMISSION_KINDS = [
  { label: 'General enquiry', value: 'contact' },
  { label: 'Membership request', value: 'membership' },
  { label: 'Partnership enquiry', value: 'partnership' },
  { label: 'Job seeker profile', value: 'career' },
  { label: 'Speaker application', value: 'speaker' },
  { label: 'Event interest', value: 'event' },
] as const

/** Every form filled on the website lands here. Created only by the site's server code. */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    group: 'Enquiries',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'organisation', 'email', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'organisation'],
    description: 'Form fills, membership requests, speaker applications and job-seeker profiles. Use Filters to narrow the list and the ⋮ menu → Export to download CSV.',
  },
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  lockDocuments: false,
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'kind', type: 'select', required: true, options: [...SUBMISSION_KINDS] },
        { name: 'status', type: 'select', defaultValue: 'new', options: [{ label: 'New', value: 'new' }, { label: 'In progress', value: 'in-progress' }, { label: 'Closed', value: 'closed' }] },
      ],
    },
    { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'email', type: 'email', required: true }, { name: 'phone', type: 'text' }] },
    { type: 'row', fields: [{ name: 'organisation', type: 'text' }, { name: 'designation', type: 'text' }] },
    { type: 'row', fields: [{ name: 'linkedin', type: 'text' }, { name: 'city', type: 'text' }] },
    { name: 'interest', type: 'text', admin: { description: 'What they want to explore, or their area of expertise.' } },
    { name: 'message', type: 'textarea' },
    { name: 'experience', type: 'textarea', label: 'Previous speaking experience' },
    { name: 'resume', type: 'upload', relationTo: 'resumes' },
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'sourcePage', type: 'text', admin: { readOnly: true } },
    { name: 'notes', type: 'textarea', label: 'Internal notes', admin: { description: 'Only visible to the team.' } },
  ],
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Newsletter subscriber', plural: 'Newsletter subscribers' },
  admin: { group: 'Enquiries', useAsTitle: 'email', defaultColumns: ['email', 'createdAt'] },
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  lockDocuments: false,
  fields: [{ name: 'email', type: 'email', required: true, unique: true }],
}
