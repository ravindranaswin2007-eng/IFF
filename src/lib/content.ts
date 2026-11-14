import 'server-only'
import type { EventItem, InsightItem } from '@/components/iff'
import { eventPhoto, photo } from './default-photos'
import { getEvents, getPosts, getSettings, mediaUrl } from './payload'

const categoryLabel: Record<string, string> = { roundtable: 'Roundtables', webinar: 'Webinars', networking: 'Networking', summit: 'Summits', weekly: 'Weekly Meetings' }
const postLabel: Record<string, string> = { blog: 'COMMENTARY', report: 'REPORT', podcast: 'PODCAST', webinar: 'WEBINAR', news: 'NEWS' }

/** The client's original event cards, shown until events are added in the admin. */
const defaultEvents: EventItem[] = [
  { key: 'risk', title: 'IFF Risk & Compliance Roundtable', category: 'Roundtables', text: 'Managing systemic liquidity pressures, cyber exposure and evolving regulation.', image: photo.leadershipDinner, href: '/contact' },
  { key: 'lending', title: 'Digital Lending & FLDG Masterclass', category: 'Webinars', text: 'Decoding credit, digital lending guidelines and responsible innovation.', image: photo.knowledgeSession, href: '/contact' },
  { key: 'women', title: 'Women in BFSI Leadership Assembly', category: 'Networking', text: 'Connecting leaders and celebrating the perspectives shaping finance.', image: photo.networkingEvening, href: '/contact' },
  { key: 'treasury', title: 'Treasury & Liquidity Management', category: 'Roundtables', text: 'Fresh perspectives on liquidity strategy and financial resilience.', image: photo.leadersGathering, href: '/contact' },
]

/** The client's original insight cards, shown until Knowledge Hub items are published in the admin. */
const defaultInsights: InsightItem[] = [
  { key: 1, category: 'COMMENTARY', title: 'The next phase of digital lending in India', text: 'How institutional collaboration, responsible innovation and evolving regulation are shaping the future of credit.' },
  { key: 2, category: 'INSIGHT', title: 'Building future-ready BFSI talent', text: 'A perspective on the skills, leadership and connections that will shape the next generation of financial professionals.' },
  { key: 3, category: 'PERSPECTIVE', title: 'What’s next for India’s financial sector?', text: 'Exploring opportunities and priorities for banking, insurance, asset management and fintech.' },
]

export async function eventCards() {
  const events = await getEvents()
  const featured = events.find(e => e.featured) ?? events.find(e => e.category === 'summit')
  const cards: EventItem[] = events.filter(e => e.id !== featured?.id).map(e => ({
    key: e.id,
    title: e.title,
    category: categoryLabel[e.category] ?? e.category,
    text: e.summary,
    image: mediaUrl(e.image, 'card') ?? eventPhoto[e.category] ?? photo.leadershipDinner,
    href: e.registrationUrl || `/contact?interest=event&event=${e.slug}`,
    external: Boolean(e.registrationUrl),
  }))
  return { cards: cards.length ? cards : defaultEvents, featured }
}

export async function insightCards(): Promise<InsightItem[]> {
  const [featured, latest] = await Promise.all([getPosts({ featured: true, limit: 3 }), getPosts({ limit: 3 })])
  const posts = [...featured, ...latest.filter(p => !featured.some(f => f.id === p.id))].slice(0, 3)
  return posts.length ? posts.map(p => ({ key: p.id, category: postLabel[p.type] ?? 'INSIGHT', title: p.title, text: p.excerpt, href: `/knowledge-hub/${p.slug}` })) : defaultInsights
}

export async function partnerNames() {
  const settings = await getSettings()
  return settings.partners?.length ? settings.partners.map(p => p.name) : undefined
}
