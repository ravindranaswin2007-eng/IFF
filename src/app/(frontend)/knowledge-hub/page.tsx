import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText, Headphones, Newspaper, Video } from 'lucide-react'
import { Callout, Eyebrow, Hero, Section } from '@/components/iff'
import { slot } from '@/lib/default-photos'
import { getPosts, mediaUrl } from '@/lib/payload'

export const metadata: Metadata = { title: 'Knowledge Hub', description: 'Blogs and webinars from the Indian Financial Forum community.' }

type Card = { key: string | number; type: string; title: string; text: string; meta: string; image: string; href?: string }
const labels: Record<string, string> = { blog: 'Blogs', report: 'Reports', podcast: 'Podcasts', webinar: 'Webinars', news: 'News' }
const typeIcons: Record<string, typeof Newspaper> = { Blogs: Newspaper, Reports: FileText, Podcasts: Headphones, Webinars: Video, News: Newspaper }

/** The client's original Knowledge Hub content, shown until items are published in the admin. */
const defaults: Omit<Card, 'image'>[] = [
  { key: 'b1', type: 'Blogs', title: 'The next phase of digital lending in India', text: 'How responsible innovation and evolving regulation are reshaping credit.', meta: '6 min read' },
  { key: 'b2', type: 'Blogs', title: 'Building future-ready BFSI talent', text: 'The skills and leadership that will define the next generation of finance professionals.', meta: '5 min read' },
  { key: 'b3', type: 'Blogs', title: 'Blog 03', text: 'More perspectives from the IFF community coming soon.', meta: 'Upcoming blog' },
  { key: 'b4', type: 'Blogs', title: 'Blog 04', text: 'More perspectives from the IFF community coming soon.', meta: 'Upcoming blog' },
  { key: 'w1', type: 'Webinars', title: 'Digital Lending & FLDG Masterclass', text: 'Decoding digital lending guidelines and first-loss default guarantee frameworks.', meta: '60 min session' },
  { key: 'w2', type: 'Webinars', title: 'Treasury & Liquidity Management', text: 'Fresh perspectives on liquidity strategy and financial resilience.', meta: '45 min session' },
  { key: 'w3', type: 'Webinars', title: 'Webinar 03', text: 'More conversations with financial leaders coming soon.', meta: 'Upcoming webinar' },
  { key: 'w4', type: 'Webinars', title: 'Webinar 04', text: 'More conversations with financial leaders coming soon.', meta: 'Upcoming webinar' },
]

export default async function Knowledge() {
  const posts = await getPosts({ limit: 200 })
  const fallback = (type: string, i: number) => (type === 'Webinars' ? slot.knowledgeWebinars : slot.knowledgeBlogs)[i % 4]!
  let cards: Card[]
  if (posts.length) {
    const count: Record<string, number> = {}
    cards = posts.map(p => { const type = labels[p.type] ?? 'Blogs'; const i = (count[type] = (count[type] ?? -1) + 1); return { key: p.id, type, title: p.title, text: p.excerpt, meta: p.duration ?? '', image: mediaUrl(p.cover, 'card') ?? fallback(type, i), href: `/knowledge-hub/${p.slug}` } })
  } else {
    cards = defaults.map((c, i) => ({ ...c, image: fallback(c.type, i % 4) }))
  }
  const sections = ['Blogs', 'Reports', 'Podcasts', 'Webinars', 'News'].filter(t => cards.some(c => c.type === t))
  /* eslint-disable @next/next/no-img-element */
  return <>
    <Hero
      eyebrow="KNOWLEDGE HUB"
      action=""
      title={<>Ideas and insights from<br />the <em>BFSI</em> community.</>}
      description="Explore blogs and webinars created with India’s financial leaders."
    />
    {sections.map(type => <Section key={type} title={type}>
      <div className="knowledge-grid">
        {cards.filter(item => item.type === type).map(item => {
          const Icon = typeIcons[item.type] ?? Newspaper
          return <article className="feature-card knowledge-card" key={item.key}>
            <img className="knowledge-thumbnail" src={item.image} alt={`Thumbnail for ${item.title}`} width={640} height={360} loading="lazy" />
            <div className="knowledge-card-top"><Eyebrow>{item.type}</Eyebrow><Icon size={20} aria-hidden /></div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span className="knowledge-meta">{item.meta}</span>
            {item.href ? <Link className="text-link" href={item.href}>Read more <ArrowRight size={16} /></Link> : <span className="text-link" aria-disabled="true">Coming soon <ArrowRight size={16} /></span>}
          </article>
        })}
      </div>
    </Section>)}
    <Callout title="Bring your perspective to the conversation." text="Share your expertise with the IFF community through a blog or webinar." action="Contribute Your Expertise" to="/speaking" />
  </>
}
