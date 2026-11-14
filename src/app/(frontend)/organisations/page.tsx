import type { Metadata } from 'next'
import { OrganisationsView } from '@/components/pages/organisations'
import { slot } from '@/lib/default-photos'
import { getPageImages, getSettings, mediaUrl } from '@/lib/payload'

export const metadata: Metadata = { title: 'For Organisations', description: 'Partner with IFF to engage decision-makers, build brand credibility and create meaningful connections across the BFSI ecosystem.' }

export default async function Organisations() {
  const [{ hero, banner, feature }, settings] = await Promise.all([getPageImages('organisations'), getSettings()])
  const brochure = settings.brochure && typeof settings.brochure === 'object' ? settings.brochure.url ?? undefined : undefined
  return <OrganisationsView hero={mediaUrl(hero, 'xl') ?? slot.organisationsHero} feature={mediaUrl(feature) ?? slot.organisationsFeature} banner={mediaUrl(banner) ?? slot.organisationsBanner} brochure={brochure} />
}
