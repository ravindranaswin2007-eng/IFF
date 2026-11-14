import type { Metadata } from 'next'
import { GraduationCap, Mic, PlayCircle, Users } from 'lucide-react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, FeatureCard, Hero, SectionHead } from '@/components/ui'
import { getPageImages } from '@/lib/payload'

export const metadata: Metadata = { title: 'Speaking Opportunities', description: 'Share your expertise through IFF institutions, executive roundtables, webinars and flagship events.' }

const stages = [
  { title: 'Institutions', text: 'Academic institutions, policy councils and sectoral academies fostering practitioner dialogue.', icon: GraduationCap },
  { title: 'Executive roundtables', text: 'Intimate Chatham House discussions with 15–20 C-suite peers on regulation, risk and macro shifts.', icon: Users },
  { title: 'Partner webinars', text: 'Digital deep-dives and masterclasses reaching pan-India BFSI professionals.', icon: PlayCircle },
  { title: 'Flagship events', text: 'Keynotes, plenary panels and masterclasses at marquee annual summits.', icon: Mic },
]

export default async function Speaking() {
  const { hero, banner } = await getPageImages('speaking')
  return (
    <>
      <Hero image={hero} breadcrumb="Speaking" eyebrow="Speaking opportunities" title={<>Share your expertise. <em>Inspire the industry.</em></>} lead="IFF welcomes experienced professionals, industry leaders and subject-matter experts who want to share their knowledge across our events, webinars and community initiatives." actions={<ButtonLink href="#apply" variant="gold">Apply as a speaker</ButtonLink>} stats={[['450+', 'Speakers'], ['18,000+', 'Attendees'], ['25+', 'Cities']]} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Where you can speak" title="Share your expertise across the IFF ecosystem." lead="Contribute to meaningful conversations through institutions, roundtables, webinars and flagship events." />
          <Stagger className="grid grid-4">{stages.map((s) => <StaggerItem key={s.title}><FeatureCard {...s} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <section className="section bg-navy">
        <Reveal className="container quote">
          <div className="quote-mark" aria-hidden>“</div>
          <blockquote>The most impactful insights come from those who have lived the challenge.</blockquote>
          <p>IFF speakers are practitioners, regulators and innovators shaping policy, technology and governance across banking, NBFCs and fintech.</p>
        </Reveal>
      </section>

      <section className="section bg-paper" id="apply">
        <div className="container" style={{ maxWidth: 940 }}>
          <SectionHead center eyebrow="Speaker application" title="Tell us what you’d bring." lead="Share your expertise and the perspectives you can offer the IFF community." />
          <Reveal><EnquiryForm kind="speaker" sourcePage="/speaking" /></Reveal>
        </div>
      </section>

      <CtaBanner image={banner} eyebrow="Take the stage" title={<>Have something worth saying? <em>We’d like to hear it.</em></>} text="Join India’s cohort of financial leaders, regulators and innovators shaping the industry’s future." actions={<ButtonLink href="#apply" variant="gold">Apply as a speaker</ButtonLink>} />
    </>
  )
}
