import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { slugField } from '../fields/slug'

export const EVENT_CATEGORIES = [
  { label: 'Flagship Summit', value: 'summit' },
  { label: 'Executive Roundtable', value: 'roundtable' },
  { label: 'Webinar', value: 'webinar' },
  { label: 'Networking', value: 'networking' },
  { label: 'Weekly Meeting', value: 'weekly' },
] as const

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'category', 'startDate', 'city'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'startDate',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'category', type: 'select', required: true, options: [...EVENT_CATEGORIES], admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar', description: 'Highlight at the top of the Events page.' } },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Leave empty if the date is not confirmed yet.' } },
        { name: 'city', type: 'text' },
        { name: 'format', type: 'select', options: ['In-person', 'Virtual', 'Hybrid'] },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'registrationUrl', type: 'text', admin: { description: 'Optional external registration link. Without one, visitors express interest through the site and it lands in Enquiries.' } },
  ],
}
