import type { Metadata } from 'next'
import { BookOpen, BrainCircuit, CalendarDays, ChartNoAxesCombined, Coins, CreditCard, LockKeyhole, Megaphone, MapPin, MessageCircle, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Tabs } from '@/components/explorers'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, FeatureCard, Hero, SectionHead } from '@/components/ui'
import { getPageImages } from '@/lib/payload'

export const metadata: Metadata = { title: 'For Professionals', description: 'Join a thriving network of BFSI professionals through industry-focused communities, exclusive member benefits and opportunities to connect, learn and collaborate.' }

const communities: { label: string; items: [string, typeof MapPin][] }[] = [
  { label: 'Sectoral chapters', items: [['AI in Banking', BrainCircuit], ['FinTech', TrendingUp], ['Insurance', ShieldCheck], ['Wealthtech', Coins], ['Risk & Analytics', ChartNoAxesCombined], ['Payments & Lending', CreditCard], ['Data Privacy & Security', LockKeyhole]] },
  { label: 'City chapters', items: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Jaipur', 'Chandigarh', 'Dubai'].map((c): [string, typeof MapPin] => [c, MapPin]) },
  { label: 'Interest communities', items: ['Co-lending', 'Drone Finance', 'Healthcare Financing', 'AI Community', 'Green Financing', 'DPI Group'].map((c): [string, typeof MapPin] => [c, Sparkles]) },
]

const benefits = [
  { title: 'Exclusive WhatsApp communities', text: 'Stay in the loop with curated peer groups for your sector and city.', icon: MessageCircle },
  { title: 'Curated industry events', text: 'Priority access to roundtables, webinars and the annual flagship summit.', icon: CalendarDays },
  { title: 'Peers and industry leaders', text: 'Build relationships with practitioners and C-suite leaders across BFSI.', icon: Users },
  { title: 'Member-only insights', text: 'Editorial, research and policy briefings written for practitioners.', icon: BookOpen },
  { title: 'Knowledge-sharing initiatives', text: 'Contribute to working groups, publications and community programmes.', icon: BrainCircuit },
  { title: 'Speaking & collaboration', text: 'Discover opportunities to share your expertise on IFF platforms.', icon: Megaphone },
]

export default async function Professionals() {
  const { hero, banner } = await getPageImages('professionals')
  return (
    <>
      <Hero image={hero} breadcrumb="For Professionals" eyebrow="For professionals" title={<>Find your people. <em>Grow your network.</em></>} lead="Join a thriving network of BFSI professionals through industry-focused communities, exclusive member benefits and opportunities to connect, learn and collaborate." actions={<><ButtonLink href="/contact?interest=membership" variant="gold">Become a member</ButtonLink><ButtonLink href="#communities" variant="ghost">Browse communities</ButtonLink></>} stats={[['5,000+', 'Members'], ['20+', 'Chapters'], ['9', 'Cities']]} />

      <section className="section bg-paper" id="communities">
        <div className="container">
          <SectionHead eyebrow="Your IFF network" title="Choose your community." lead="Explore communities designed around your industry, your city and the ideas you care about." />
          <Reveal>
            <Tabs label="communities" tabs={communities.map((c) => ({
              label: c.label,
              content: <div className="chip-grid">{c.items.map(([name, Icon]) => <div className="chip" key={name}><Icon />{name}</div>)}</div>,
            }))} />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Being part of IFF" title="Membership benefits." lead="Make the most of your membership through access, insights and opportunities to collaborate." />
          <Stagger className="grid grid-3">{benefits.map((b, i) => <StaggerItem key={b.title}><FeatureCard {...b} index={i} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <CtaBanner image={banner} title={<>Be part of the conversations shaping <em>BFSI.</em></>} text="Join a growing community of professionals committed to learning, collaboration and industry impact." actions={<><ButtonLink href="/contact?interest=membership" variant="gold">Become a member</ButtonLink><ButtonLink href="/contact" variant="ghost">Contact us</ButtonLink></>} />
    </>
  )
}
