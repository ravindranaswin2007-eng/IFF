import type { Metadata } from 'next'
import { Briefcase, Building2, Check, Network, Users } from 'lucide-react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, Eyebrow, FeatureCard, Hero, MediaOrFallback, SectionHead } from '@/components/ui'
import { asMedia, getPageImages } from '@/lib/payload'

export const metadata: Metadata = { title: 'Job Seekers', description: 'Discover career connections, hiring partners and community-led opportunities across the IFF network.' }

const support = [
  { title: 'Job referrals', text: 'Relevant openings shared through the IFF network.', icon: Briefcase, linkLabel: 'Direct peer inflow' },
  { title: 'Hiring partners', text: 'Organisations looking for experienced BFSI talent.', icon: Building2, linkLabel: 'Enterprise leaders' },
  { title: 'Community hiring', text: 'Opportunities through IFF communities and sector networks.', icon: Users, linkLabel: 'Domain cohorts' },
  { title: 'Career connections', text: 'Relationships that open doors to new opportunities.', icon: Network, linkLabel: 'Executive mentorship' },
]

export default async function JobSeekers() {
  const { hero, banner, all } = await getPageImages('jobSeekers')
  return (
    <>
      <Hero image={hero} breadcrumb="Job Seekers" eyebrow="Careers · Job seekers" title={<>Grow your career with the <em>IFF network.</em></>} lead="Discover opportunities, connect with hiring partners and become part of a growing network of BFSI professionals." actions={<><ButtonLink href="#profile" variant="gold">Submit your profile</ButtonLink><ButtonLink href="#support" variant="ghost">How we help</ButtonLink></>} stats={[['500+', 'BFSI institutions'], ['C-Suite', 'Leadership reach'], ['Direct', 'Partner introductions']]} />

      <section className="section" id="support">
        <div className="container">
          <SectionHead eyebrow="How we support careers" title="Connections that move your career forward." lead="Referrals, hiring partners and community-led opportunities across the BFSI ecosystem." />
          <Stagger className="grid grid-4">{support.map((s) => <StaggerItem key={s.title}><FeatureCard {...s} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container split">
          <Reveal>
            <Eyebrow>The human equation</Eyebrow>
            <h2 className="h2" style={{ margin: '18px 0 22px' }}>Sometimes the next career move begins with <em>a conversation.</em></h2>
            <p className="lead">The right introduction, community or opportunity can change where your career goes next.</p>
            <ul className="check-list">{['Confidential profile sharing', 'Introductions to hiring partners', 'Mentorship from senior leaders'].map((t) => <li key={t}><Check />{t}</li>)}</ul>
          </Reveal>
          <Reveal delay={0.15} className="split-media"><MediaOrFallback media={asMedia(all.careersFeature)} size="wide" sizes="(max-width: 900px) 100vw, 50vw" /></Reveal>
        </div>
      </section>

      <section className="section" id="profile">
        <div className="container" style={{ maxWidth: 940 }}>
          <SectionHead center eyebrow="Direct network inflow" title="Submit your profile." lead="Share your details to be considered for relevant opportunities and introductions through our network." />
          <Reveal><EnquiryForm kind="career" sourcePage="/job-seekers" /></Reveal>
        </div>
      </section>

      <CtaBanner image={banner} eyebrow="Your next move" title={<>Ready for what comes <em>next?</em></>} text="Your next role, connection or opportunity may already be closer than you think." actions={<ButtonLink href="#profile" variant="gold">Submit your profile</ButtonLink>} />
    </>
  )
}
