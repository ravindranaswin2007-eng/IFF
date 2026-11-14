import type { Field, GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const PAGE_KEYS = ['about', 'professionals', 'organisations', 'events', 'jobSeekers', 'speaking'] as const
export type PageKey = (typeof PAGE_KEYS)[number]

const KEEP = 'Leave empty to keep the current IFF photo.'
const photo = (name: string, label: string, where: string): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  admin: { description: `${where} ${KEEP}` },
})

/**
 * Every photograph slot on the website, grouped by page. Choose or upload a photo, press Save,
 * and the page updates immediately. Pages not listed here (Home, Knowledge Hub, Contact) have no photos.
 */
export const SiteImages: GlobalConfig = {
  slug: 'site-images',
  label: 'Page photographs',
  admin: {
    group: 'Website',
    description: 'Change the photos on each page: click a box, upload a photo (or pick one already uploaded), then press Save. The website updates straight away.',
  },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { name: 'about', label: 'About Us', fields: [photo('hero', 'Top photo', 'The framed photo beside the page title.')] },
        {
          name: 'professionals',
          label: 'For Professionals',
          fields: [
            photo('hero', 'Top background photo', 'Full-width photo behind the page title. Use a wide (landscape) photo.'),
            photo('banner', 'Bottom banner photo', 'Faint background photo in the “Be Part of the Conversations” banner above the footer.'),
          ],
        },
        {
          name: 'organisations',
          label: 'For Organisations',
          fields: [
            photo('hero', 'Top background photo', 'Full-width photo behind the page title. Use a wide (landscape) photo.'),
            photo('feature', 'Middle photo', 'Photo beside “The right partnership puts your brand in the right room.”'),
            photo('banner', 'Bottom banner photo', 'Faint background photo in the “Create meaningful industry impact” banner above the footer.'),
          ],
        },
        {
          name: 'events',
          label: 'Events',
          fields: [
            photo('hero', 'Top photo', 'The framed photo beside the page title.'),
            photo('summit', 'Flagship summit photo', 'Photo on the right of the dark “Flagship Summit” box.'),
            {
              name: 'gallery',
              label: 'Scrolling photo strip',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: `Photos that scroll across the page below the events. Add 4–8 photos. ${KEEP}` },
            },
          ],
        },
        { name: 'jobSeekers', label: 'Job Seekers', fields: [photo('hero', 'Top photo', 'The framed photo beside the page title.')] },
        { name: 'speaking', label: 'Speaking', fields: [photo('hero', 'Top photo', 'The framed photo beside the page title.')] },
      ],
    },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Logo, partners & brochure',
  admin: { group: 'Website' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Shown in the header (and in white in the footer). Upload the colour logo as SVG or a transparent PNG. Leave empty to keep the current logo.' } },
    {
      name: 'partners',
      type: 'array',
      label: 'Partner institutions',
      labels: { singular: 'Partner', plural: 'Partners' },
      admin: { description: 'Names in the “Trusted by leading institutions” strip on Home and About. Leave empty to keep the current list.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'brochure', type: 'upload', relationTo: 'documents', label: 'Partnership brochure (PDF)', admin: { description: 'Enables the “Download Partnership Brochure” button on For Organisations.' } },
  ],
}
