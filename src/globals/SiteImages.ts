import type { Field, GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const PAGE_KEYS = ['home', 'about', 'professionals', 'organisations', 'events', 'knowledgeHub', 'jobSeekers', 'speaking', 'contact'] as const
export type PageKey = (typeof PAGE_KEYS)[number]

const labels: Record<PageKey, string> = {
  home: 'Home', about: 'About Us', professionals: 'For Professionals', organisations: 'For Organisations', events: 'Events',
  knowledgeHub: 'Knowledge Hub', jobSeekers: 'Job Seekers', speaking: 'Speaking', contact: 'Contact Us',
}

const img = (name: string, label: string, description: string): Field => ({ name, label, type: 'upload', relationTo: 'media', admin: { description } })

/** One place to set the photographs on every page's hero and closing banner. */
export const SiteImages: GlobalConfig = {
  slug: 'site-images',
  label: 'Page photographs',
  admin: { group: 'Settings', description: 'Hero (top) and closing-banner (above the footer) photograph for each page. Landscape photos at least 2400px wide work best.' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        ...PAGE_KEYS.map((key) => ({
          name: key,
          label: labels[key],
          fields: [
            img('hero', 'Hero photograph', 'Full-width image behind the page title.'),
            img('banner', 'Closing banner photograph', 'Full-width image in the banner right above the footer.'),
          ],
        })),
        {
          label: 'Other photographs',
          fields: [
            img('summit', 'Flagship summit', 'Events page – flagship summit feature.'),
            img('organisationsFeature', 'Organisations feature', 'For Organisations – “right room” section.'),
            img('careersFeature', 'Careers feature', 'Job Seekers – “conversation” section.'),
            img('aboutStory', 'About story', 'About Us – our journey section.'),
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, admin: { description: 'Event highlights strip on the Home and Events pages.' } },
          ],
        },
      ],
    },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Full-colour logo for light backgrounds (SVG or transparent PNG).' } },
    { name: 'logoInverse', type: 'upload', relationTo: 'media', label: 'Logo (white version)', admin: { description: 'Optional white logo for dark backgrounds. If empty, the main logo is shown in white.' } },
    { type: 'row', fields: [{ name: 'email', type: 'email' }, { name: 'phone', type: 'text' }] },
    { name: 'offices', type: 'array', fields: [{ name: 'city', type: 'text', required: true }, { name: 'address', type: 'text' }] },
    { type: 'row', fields: [{ name: 'linkedin', type: 'text', label: 'LinkedIn URL' }, { name: 'whatsapp', type: 'text', label: 'WhatsApp community link' }] },
    { name: 'partners', type: 'array', label: 'Partner institutions', admin: { description: 'Shown in the “trusted by” strip. Add a logo, or just a name.' }, fields: [{ name: 'name', type: 'text', required: true }, { name: 'logo', type: 'upload', relationTo: 'media' }] },
    { name: 'brochure', type: 'upload', relationTo: 'documents', label: 'Partnership brochure' },
  ],
}
