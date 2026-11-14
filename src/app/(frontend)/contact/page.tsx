import type { Metadata } from 'next'
import { Briefcase, CalendarDays, Coffee, Mail, MapPin, MessageSquare, Phone, Video } from 'lucide-react'
import { EnquiryForm } from '@/components/EnquiryForm'
import { Reveal } from '@/components/motion'
import { ButtonLink, CtaBanner, Hero } from '@/components/ui'
import { getPageImages, getSettings } from '@/lib/payload'

export const metadata: Metadata = { title: 'Contact Us', description: 'Start a membership, institutional partnership or executive dialogue with the Indian Financial Forum.' }

const interestMap: Record<string, string> = { membership: 'Membership', partnership: 'Institutional Partnership', event: 'Event participation' }

export default async function Contact({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const [{ hero, banner }, settings] = await Promise.all([getPageImages('contact'), getSettings()])
  const interest = sp.interest ? interestMap[sp.interest] ?? sp.interest : undefined
  const offices = settings.offices?.length ? settings.offices : [{ city: 'Mumbai', address: 'BKC Financial District', id: 'mum' }, { city: 'New Delhi', address: 'Connaught Place', id: 'del' }]
  return (
    <>
      <Hero image={hero} breadcrumb="Contact Us" eyebrow="Partnerships & enquiries" title={<>Let’s start something <em>meaningful.</em></>} lead="Whether you want to join the IFF ecosystem, explore a partnership or collaborate with the BFSI community, tell us about yourself and we’ll connect you with the right team." actions={<ButtonLink href="#enquiry" variant="gold">Get in touch</ButtonLink>} />

      <section className="section" id="enquiry">
        <div className="container contact-layout">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
            <h2 className="h2" style={{ margin: '18px 0 14px' }}>Tell us about you.</h2>
            <p className="lead" style={{ marginBottom: 32 }}>Membership requests, partnership enquiries and event interest all reach the IFF secretariat directly.</p>
            <EnquiryForm kind="contact" defaults={interest ? { interest } : {}} event={sp.event} sourcePage="/contact" />
          </Reveal>
          <Reveal delay={0.15}>
            <aside className="aside-card">
              <h3>Engagement formats</h3>
              <ul className="aside-list">
                {[[Coffee, 'Breakfast meetings'], [MessageSquare, 'Executive roundtables'], [CalendarDays, 'National summits'], [Briefcase, 'BFSI talent & leadership hiring'], [Video, 'Specialised webinars']].map(([Icon, t]) => {
                  const I = Icon as typeof Coffee
                  return <li key={String(t)}><I />{String(t)}</li>
                })}
              </ul>
            </aside>
            <aside className="aside-card">
              <h3>Institutional secretariat</h3>
              <ul className="aside-list">
                {offices.map((o) => <li key={o.id ?? o.city}><MapPin /><span><strong>{o.city}</strong>{o.address ? ` — ${o.address}` : ''}</span></li>)}
                {settings.email && <li><Mail /><a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
                {settings.phone && <li><Phone /><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></li>}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>

      <CtaBanner image={banner} title={<>Join the community behind <em>BFSI leadership.</em></>} text="Connect with peers, partners and leaders across India’s financial ecosystem." actions={<><ButtonLink href="/professionals" variant="gold">For professionals</ButtonLink><ButtonLink href="/organisations" variant="ghost">For organisations</ButtonLink></>} />
    </>
  )
}
