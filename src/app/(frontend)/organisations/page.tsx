import type { Metadata } from 'next'
import { BookOpen, Check, Download, Handshake, Lightbulb, Megaphone, MessagesSquare, Network, Target, TrendingUp, Users } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, Eyebrow, FeatureCard, Hero, MediaOrFallback, SectionHead } from '@/components/ui'
import { asMedia, getPageImages, getSettings } from '@/lib/payload'

export const metadata: Metadata = { title: 'For Organisations', description: 'Partner with IFF to engage decision-makers, build brand credibility and create meaningful connections across the BFSI ecosystem.' }

const ways = [
  { title: 'Strategic partnerships', text: 'Build long-term associations around shared industry priorities.', icon: Handshake },
  { title: 'Sponsorship', text: 'Put your brand alongside relevant conversations, communities and experiences.', icon: Users },
  { title: 'Executive roundtables', text: 'Engage senior decision-makers through focused, high-value discussions.', icon: MessagesSquare },
  { title: 'Thought leadership', text: 'Bring your expertise into conversations that matter to BFSI.', icon: Lightbulb },
  { title: 'Community engagement', text: 'Connect meaningfully with professionals across sectors and markets.', icon: Network },
  { title: 'Brand collaborations', text: 'Create relevant campaigns, experiences and initiatives with the IFF ecosystem.', icon: Megaphone },
]
const why = [
  { title: 'Reach the right audience', text: 'A curated community of BFSI professionals and decision-makers.', icon: Target },
  { title: 'Meet industry leaders', text: 'Opportunities to engage senior voices and regulators.', icon: Users },
  { title: 'Build brand credibility', text: 'Visibility in an environment built around industry relevance.', icon: TrendingUp },
  { title: 'Back knowledge-led initiatives', text: 'Support platforms designed for learning and professional exchange.', icon: BookOpen },
]

export default async function Organisations() {
  const [{ hero, banner, all }, settings] = await Promise.all([getPageImages('organisations'), getSettings()])
  const brochure = settings.brochure && typeof settings.brochure === 'object' ? settings.brochure : null
  return (
    <>
      <Hero image={hero} breadcrumb="For Organisations" eyebrow="For organisations" title={<>Partner with the people who <em>shape BFSI.</em></>} lead="Build credibility, engage decision-makers and create meaningful connections across the financial ecosystem." actions={<><ButtonLink href="/contact?interest=Institutional%20Partnership#enquiry" variant="gold">Partner with us</ButtonLink>{brochure?.url && <a className="btn btn-ghost" href={brochure.url} download><Download />Partnership brochure</a>}</>} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How we can work together" title="There’s more than one way to make an impact." lead="From focused leadership conversations to wider community engagement, we shape partnerships around what your organisation wants to achieve." />
          <Stagger className="grid grid-3">{ways.map((w, i) => <StaggerItem key={w.title}><FeatureCard {...w} index={i} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <section className="section bg-navy">
        <div className="container split reverse">
          <Reveal className="split-media"><MediaOrFallback media={asMedia(all.organisationsFeature)} size="wide" sizes="(max-width: 900px) 100vw, 50vw" /></Reveal>
          <Reveal delay={0.15}>
            <Eyebrow light>Partnerships that matter</Eyebrow>
            <h2 className="h2" style={{ margin: '18px 0 22px' }}>The right partnership puts your brand in the <em>right room.</em></h2>
            <p className="lead">With the right people. Around the right conversation. At the right time.</p>
            <ul className="check-list">{['Closed-door access to C-suite and regulators', 'Co-created content and research', 'Year-round visibility across IFF chapters'].map((t) => <li key={t}><Check />{t}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Why partner with IFF" title="Be visible where the right conversations happen." lead="IFF brings professionals, leaders and organisations together — so brands can participate with relevance and purpose." />
          <Stagger className="grid grid-4">{why.map((w) => <StaggerItem key={w.title}><FeatureCard {...w} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <CtaBanner image={banner} eyebrow="Partner with IFF" title={<>Create meaningful <em>industry impact.</em></>} text="Whether you want to partner, sponsor, collaborate or engage the ecosystem, we’ll shape an opportunity around what you want to achieve." actions={<ButtonLink href="/contact?interest=Institutional%20Partnership#enquiry" variant="gold">Start a conversation</ButtonLink>} />
    </>
  )
}
