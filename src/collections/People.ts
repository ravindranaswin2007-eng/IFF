import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

const personFields: CollectionConfig['fields'] = [
  { name: 'name', type: 'text', required: true },
  { type: 'row', fields: [{ name: 'designation', type: 'text' }, { name: 'organisation', type: 'text' }] },
  { name: 'photo', type: 'upload', relationTo: 'media' },
  { type: 'row', fields: [{ name: 'linkedin', type: 'text', label: 'LinkedIn URL' }, { name: 'city', type: 'text' }] },
  { name: 'order', type: 'number', admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
]

export const Leaders: CollectionConfig = {
  slug: 'leaders',
  labels: { singular: 'Leader', plural: 'Leadership' },
  admin: { group: 'People', useAsTitle: 'name', defaultColumns: ['name', 'group', 'designation'], description: 'Shown under Leadership & Ecosystem Council on About Us. Once you add someone, the sample names disappear.' },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'order',
  fields: [
    ...personFields,
    { name: 'group', type: 'select', required: true, defaultValue: 'community', options: [{ label: 'Community Leadership', value: 'community' }, { label: 'Senior Advisory Council', value: 'advisory' }], admin: { position: 'sidebar' } },
    { name: 'bio', type: 'textarea' },
  ],
}

export const Volunteers: CollectionConfig = {
  slug: 'volunteers',
  admin: { group: 'People', useAsTitle: 'name', defaultColumns: ['name', 'designation', 'organisation', 'city', 'active'], description: 'Shown under “Active Volunteers” on About Us. The Active Volunteers section appears on the site once you add the first one. To add many at once, use ⋮ → Import with a CSV.' },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'order',
  fields: [
    ...personFields,
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to hide from the website.' } },
    { name: 'photoSourceUrl', type: 'text', admin: { position: 'sidebar', readOnly: true, description: 'Original photo link from the Google Form.' } },
  ],
}
