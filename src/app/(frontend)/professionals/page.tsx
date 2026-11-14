import type { Metadata } from 'next'
import { ProfessionalsView } from '@/components/pages/professionals'
import { slot } from '@/lib/default-photos'
import { getPageImages, mediaUrl } from '@/lib/payload'

export const metadata: Metadata = { title: 'For Professionals', description: 'Join a thriving network of BFSI professionals through industry-focused communities, exclusive member benefits and opportunities to connect, learn and collaborate.' }

export default async function Professionals() {
  const { hero, banner } = await getPageImages('professionals')
  return <ProfessionalsView hero={mediaUrl(hero, 'xl') ?? slot.professionalsHero} banner={mediaUrl(banner) ?? slot.professionalsBanner} />
}
