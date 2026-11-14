import type { Metadata } from 'next'
import { BookOpen, Handshake, Lightbulb, Megaphone, Sparkles, Users } from 'lucide-react'
import { PersonCard } from '@/components/cards'
import { DrawLine, Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, Eyebrow, FeatureCard, Hero, MediaOrFallback, SectionHead } from '@/components/ui'
import { asMedia, getPageImages, getPeople } from '@/lib/payload'

export const metadata: Metadata = { title: 'About Us', description: 'Meet the community, leadership and core values behind the Indian Financial Forum.' }

const journey = [
  ['Genesis & vision', 'Founded with a clear purpose: to create a trusted platform for genuine regulatory, policy and operational debate.'],
  ['Pan-India chapters', 'Rapid scaling across financial and technology hubs, connecting regional leadership with national perspectives.'],
  ['5,000+ fellowships', 'Cross-functional executive networks across banking, insurance, asset management and fintech.'],
  ['Institutional council', 'Experienced decision-makers guiding dialogue, innovation and responsible industry collaboration.'],
]

const pillars = [
  { title: 'Community first', icon: Users, text: 'Long-term, high-trust relationships built on genuine peer exchange.' },
  { title: 'Knowledge exchange', icon: BookOpen, text: 'Practitioner-led insight on policy, risk, technology and leadership.' },
  { title: 'High-level collaboration', icon: Handshake, text: 'Bringing institutions, regulators and innovators to the same table.' },
  { title: 'Executive leadership', icon: Sparkles, text: 'Developing the leaders who will shape India’s financial future.' },
  { title: 'Visibility & discovery', icon: Megaphone, text: 'Giving members and partners a platform for their ideas and work.' },
  { title: 'Financial innovation', icon: Lightbulb, text: 'Championing responsible innovation across the BFSI ecosystem.' },
]

export default async function About() {
  const [{ hero, banner, all }, { leaders, volunteers }] = await Promise.all([getPageImages('about'), getPeople()])
  const community = leaders.filter((l) => l.group === 'community')
  const advisory = leaders.filter((l) => l.group === 'advisory')
  return (
    <>
      <Hero image={hero} breadcrumb="About Us" eyebrow="About IFF" title={<>Who we are — empowering India’s <em>BFSI leadership.</em></>} lead="An industry-first platform uniting executive leadership and forward-looking practitioners across banking, securities markets, insurance, asset management and fintech." actions={<ButtonLink href="/professionals" variant="gold">Explore communities</ButtonLink>} />

      <section className="section">
        <div className="container split">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="h2" style={{ margin: '18px 0 22px' }}>Where BFSI governance meets <em>real dialogue.</em></h2>
            <p className="lead">We activate trusted peer-to-peer conversations, institutional proximity and cross-sector collaboration to elevate India’s financial architecture.</p>
            <p className="lead" style={{ marginTop: 14 }}>What began as an informal network of industry leaders is now a pan-India community of practitioners, regulators and innovators.</p>
          </Reveal>
          <Reveal delay={0.15} className="split-media"><MediaOrFallback media={asMedia(all.aboutStory)} size="wide" sizes="(max-width: 900px) 100vw, 50vw" /></Reveal>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container">
          <SectionHead eyebrow="Our journey" title="From a closed-door circle to a pan-India community." lead="The milestones that transformed an informal network of financial leaders into an influential institution." />
          <div className="timeline">
            <DrawLine className="timeline-line" />
            {journey.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.12} className="timeline-step"><span className="dot">0{i + 1}</span><h3>{t}</h3><p>{d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="The ecosystem engine" title="Six pillars of ecosystem impact." lead="Designed by practitioners, for practitioners." />
          <Stagger className="grid grid-3">{pillars.map((p, i) => <StaggerItem key={p.title}><FeatureCard icon={p.icon} title={p.title} text={p.text} index={i} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <section className="section bg-cool" id="leadership">
        <div className="container">
          <SectionHead eyebrow="Governance & stewardship" title="Leadership & ecosystem council." lead="Guided by senior practitioners committed to an uncompromising standard of BFSI dialogue." />
          {community.length > 0 && (<><div className="subhead"><h3>Community leadership</h3></div><Stagger className="people-grid">{community.map((p) => <StaggerItem key={p.id}><PersonCard person={p} /></StaggerItem>)}</Stagger></>)}
          {advisory.length > 0 && (<><div className="subhead"><h3>Senior advisory council</h3></div><Stagger className="people-grid">{advisory.map((p) => <StaggerItem key={p.id}><PersonCard person={p} /></StaggerItem>)}</Stagger></>)}
          <div id="volunteers" className="subhead"><h3>Active volunteers</h3>{volunteers.length > 0 && <span>{volunteers.length} people powering IFF chapters</span>}</div>
          {volunteers.length > 0 ? (
            <Stagger className="people-grid compact">{volunteers.map((v) => <StaggerItem key={v.id}><PersonCard person={v} /></StaggerItem>)}</Stagger>
          ) : (
            <div className="empty-state"><h3>Volunteer profiles are on their way.</h3><p>Want to help run an IFF chapter? <a className="link-arrow" href="/contact?interest=Other">Get in touch</a></p></div>
          )}
        </div>
      </section>

      <CtaBanner image={banner} title={<>Ready to make an impact with <em>IFF?</em></>} text="Connect with peers across banking, securities, insurance and fintech to shape industry perspectives and create enduring professional value." actions={<><ButtonLink href="/contact?interest=membership" variant="gold">Become a member</ButtonLink><ButtonLink href="/contact?interest=Other" variant="ghost">Volunteer with us</ButtonLink></>} />
    </>
  )
}
