import { BarChart3, Building2, Landmark, Leaf, ShieldCheck, Smartphone, Wallet } from 'lucide-react'
import { EventCard, PostCard } from '@/components/cards'
import { PathExplorer } from '@/components/explorers'
import { gridFor } from '@/lib/grid'
import { Gallery, Marquee } from '@/components/Marquee'
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, FeatureCard, Hero, Img, SectionHead } from '@/components/ui'
import { asMedia, getEvents, getPageImages, getPosts, getSettings } from '@/lib/payload'
import type { Media } from '@/payload-types'

const impact: [string, string, string][] = [
  ['5,000+', 'Community members', 'From senior leaders and practitioners to emerging industry talent.'],
  ['250+', 'Industry leaders', 'C-suite voices bringing experience and forward thinking.'],
  ['100+', 'Events hosted', 'Roundtables, summits and focused networking assemblies.'],
  ['25+', 'Cities & communities', 'Connecting regional and metropolitan financial centres.'],
]

const communities = [
  { title: 'Retail Banking', icon: Landmark },
  { title: 'Digital Finance', icon: Smartphone },
  { title: 'Risk & Compliance', icon: ShieldCheck },
  { title: 'Wealth & Asset Management', icon: BarChart3 },
  { title: 'Payments & FinTech', icon: Wallet },
  { title: 'Sustainable Finance', icon: Leaf },
]

export default async function Home() {
  const [{ hero, banner, all }, settings, events, featured, latest] = await Promise.all([
    getPageImages('home'), getSettings(), getEvents(12), getPosts({ featured: true, limit: 3 }), getPosts({ limit: 3 }),
  ])
  const upcoming = events.filter((e) => !e.startDate || new Date(e.startDate) >= new Date(Date.now() - 864e5)).slice(0, 3)
  const posts = [...featured, ...latest.filter((p) => !featured.some((f) => f.id === p.id))].slice(0, 3)
  const gallery = ((all.gallery ?? []) as unknown[]).map(asMedia).filter(Boolean) as Media[]
  const pathImage = (key: 'professionals' | 'organisations' | 'events' | 'knowledgeHub') => <Img media={asMedia(all[key]?.hero)} size="wide" sizes="(max-width: 900px) 100vw, 55vw" />

  return (
    <>
      <Hero
        home
        image={hero}
        eyebrow="India’s leading financial forum"
        title={<>The community behind the growth of every <em>BFSI professional.</em></>}
        lead="A place where India’s banking, insurance, capital-markets and fintech leaders connect, collaborate and grow — together."
        actions={<><ButtonLink href="/contact?interest=membership" variant="gold">Join IFF</ButtonLink><ButtonLink href="/organisations" variant="ghost">Partner with us</ButtonLink></>}
      />

      {settings.partners && settings.partners.length > 0 && (
        <div className="partner-bar">
          <div className="container partner-bar-head"><span>Trusted by leading institutions across the BFSI ecosystem</span></div>
          <Marquee partners={settings.partners} />
        </div>
      )}

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our impact" title={<>A larger, stronger <em>BFSI</em> community.</>} lead="Bringing professionals, leaders and organisations together to exchange knowledge, build relationships and create new opportunities across financial services." />
          <Stagger className="stats-band">
            {impact.map(([n, t, d]) => (
              <StaggerItem key={t}><strong><CountUp value={n} /></strong><h3>{t}</h3><p>{d}</p></StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container">
          <SectionHead eyebrow="Explore IFF" title="Find the experience that’s right for you." lead="Grow your network, build visibility, find an event or discover new thinking — choose where you want to go next." />
          <Reveal>
            <PathExplorer
              items={[
                { title: 'For Professionals', summary: 'Communities, insight and peer connection.', text: 'Join sector and city chapters, take part in closed-door dialogue and connect with the leaders shaping India’s financial ecosystem.', points: ['Sector chapters', 'City chapters', 'Member insights', 'Peer exchange'], action: <ButtonLink href="/professionals" variant="gold">Explore communities</ButtonLink>, image: pathImage('professionals') },
                { title: 'For Organisations', summary: 'Partnerships that put you in the right room.', text: 'Build trusted relationships with India’s financial leadership through partnerships, curated roundtables and collaborative initiatives.', points: ['Strategic partnerships', 'Sponsorship', 'Thought leadership', 'Talent'], action: <ButtonLink href="/organisations" variant="gold">Partner with IFF</ButtonLink>, image: pathImage('organisations') },
                { title: 'Events', summary: 'Summits, roundtables and assemblies.', text: 'Experience conversations that matter — from intimate Chatham House roundtables to the annual flagship summit.', points: ['Executive roundtables', 'Webinars', 'Flagship summit', 'Weekly meetings'], action: <ButtonLink href="/events" variant="gold">See upcoming events</ButtonLink>, image: pathImage('events') },
                { title: 'Knowledge Hub', summary: 'Blogs, reports and podcasts.', text: 'Practical perspectives on policy, leadership, emerging technology and the future of Indian financial services.', points: ['Blogs', 'Reports', 'Podcasts', 'Webinars'], action: <ButtonLink href="/knowledge-hub" variant="gold">Read the latest</ButtonLink>, image: pathImage('knowledgeHub') },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Industry communities" title="Find your industry network." lead="Focused communities for people working across the financial ecosystem. Find the one that matches your world." />
          <Stagger className="grid grid-3">
            {communities.map((c, i) => (
              <StaggerItem key={c.title}>
                <FeatureCard icon={c.icon} index={i} title={c.title} text="Connect with industry peers, exchange practical perspectives and contribute to the conversations shaping your sector." href="/professionals#communities" linkLabel="Explore network" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="section bg-cool">
          <div className="container">
            <SectionHead eyebrow="Events at IFF" title="Upcoming experiences." lead="Curated conversations to meet peers, exchange perspectives and build relationships."><div style={{ marginTop: 20 }}><ButtonLink href="/events" variant="outline">View all events</ButtonLink></div></SectionHead>
            <Stagger className={gridFor(upcoming.length)}>
              {upcoming.map((e) => <StaggerItem key={e.id}><EventCard event={e} /></StaggerItem>)}
            </Stagger>
          </div>
        </section>
      )}

      {gallery.length > 0 && <section className="section-tight"><Gallery images={gallery} /></section>}

      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="Knowledge & insights" title={<>Perspectives shaping the future of <em>BFSI.</em></>} lead="Ideas and practical intelligence from people working at the centre of financial services."><div style={{ marginTop: 20 }}><ButtonLink href="/knowledge-hub" variant="outline">Explore Knowledge Hub</ButtonLink></div></SectionHead>
            <Stagger className={gridFor(posts.length)}>
              {posts.map((p) => <StaggerItem key={p.id}><PostCard post={p} /></StaggerItem>)}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBanner
        image={banner}
        title={<>Ready to be part of what’s <em>next?</em></>}
        text="Join India’s financial community to connect, collaborate and create meaningful impact."
        actions={<><ButtonLink href="/contact?interest=membership" variant="gold">Become a member</ButtonLink><ButtonLink href="/contact" variant="ghost">Talk to us</ButtonLink></>}
      />
    </>
  )
}
