import type { Metadata } from 'next'
import { HomeView } from '@/components/pages/home'
import { eventCards, insightCards, partnerNames } from '@/lib/content'

export const metadata: Metadata = { title: 'The Community Behind BFSI Leadership', description: 'Connect with India’s financial community. Explore professional networks, leadership events and institutional partnerships with IFF.' }

export default async function Home() {
  const [{ cards }, insights, partners] = await Promise.all([eventCards(), insightCards(), partnerNames()])
  return <HomeView events={cards} insights={insights} partners={partners} />
}
