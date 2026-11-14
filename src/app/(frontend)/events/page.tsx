import type { Metadata } from 'next'
import { CalendarDays, MapPin, Mic, PlayCircle, Users } from 'lucide-react'
import { EventCard, eventCategoryLabel, interestHref } from '@/components/cards'
import { FilterGrid } from '@/components/explorers'
import { Gallery } from '@/components/Marquee'
import { CountUp, Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, FeatureCard, Hero, MediaOrFallback, SectionHead } from '@/components/ui'
import { defaultEventImage } from '@/lib/default-photos'
import { formatDate } from '@/lib/media'
import { asMedia, getEvents, getPageImages } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const metadata: Metadata = { title: 'Events', description: 'Explore IFF summits, executive roundtables, webinars and leadership gatherings.' }

const formats = [
  { title: 'Weekly meetings', text: 'Curated peer dialogues on pressing financial challenges, regulatory updates and industry narratives.', icon: CalendarDays, linkLabel: 'Every Thursday' },
  { title: 'Executive roundtables', text: 'Closed-door Chatham House discussions for C-suite leaders and regulators.', icon: Users, linkLabel: 'Monthly C-suite sessions' },
  { title: 'Webinars', text: 'Digital deep-dives on frameworks, compliance and operating strategy.', icon: PlayCircle, linkLabel: 'Pan-India virtual access' },
  { title: 'Flagship summit', text: 'The annual assembly uniting institutional leaders, regulators and innovators.', icon: Mic, linkLabel: 'Annual summit' },
]

export default async function Events() {
  const [{ hero, banner, all }, events] = await Promise.all([getPageImages('events'), getEvents()])
  const featured = events.find((e) => e.featured) ?? events.find((e) => e.category === 'summit')
  const rest = events.filter((e) => e.id !== featured?.id)
  const gallery = ((all.gallery ?? []) as unknown[]).map(asMedia).filter(Boolean) as Media[]
  return (
    <>
      <Hero image={hero} breadcrumb="Events" eyebrow="Events" title={<>Experiences that bring the <em>BFSI ecosystem</em> together.</>} lead="From intimate conversations to industry-wide gatherings, IFF creates experiences that connect the ecosystem through knowledge, networking and collaboration." actions={<><ButtonLink href="#upcoming" variant="gold">Upcoming events</ButtonLink><ButtonLink href="/contact?interest=Sponsorship#enquiry" variant="ghost">Partner with us</ButtonLink></>} />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Structured engagement" title="Event formats." lead="Engage with the IFF community through formats tailored to your priorities." />
          <Stagger className="grid grid-4">{formats.map((f) => <StaggerItem key={f.title}><FeatureCard {...f} /></StaggerItem>)}</Stagger>
        </div>
      </section>

      <section className="section bg-cool" id="upcoming">
        <div className="container">
          <SectionHead eyebrow="Scheduled experiences" title="Upcoming events." />
          {featured && (
            <Reveal className="feature-event">
              <div className="content">
                <span className="gold-label">{eventCategoryLabel[featured.category]}</span>
                <h3>{featured.title}</h3>
                <p>{featured.summary}</p>
                <div className="facts">
                  <span><CalendarDays />{formatDate(featured.startDate, { day: 'numeric', month: 'long', year: 'numeric' }) ?? 'Date to be announced'}</span>
                  {featured.city && <span><MapPin />{featured.city}</span>}
                  {featured.format && <span><Users />{featured.format}</span>}
                </div>
                <div><ButtonLink href={interestHref(featured)} variant="gold">{featured.registrationUrl ? 'Register' : 'Express interest'}</ButtonLink></div>
              </div>
              <div className="media"><MediaOrFallback media={asMedia(featured.image) ?? asMedia(all.summit) ?? defaultEventImage[featured.category]} icon={Mic} size="wide" sizes="(max-width: 860px) 100vw, 45vw" /></div>
            </Reveal>
          )}
          <FilterGrid
            label="Event categories"
            items={rest.map((e) => ({ key: e.id, category: e.category, node: <EventCard event={e} /> }))}
            categories={Object.entries(eventCategoryLabel).map(([value, label]) => ({ value, label }))}
            empty={!featured && <div className="empty-state"><h3>New dates are being finalised.</h3><p>Register your interest and we’ll invite you to the next session.</p><div className="section-foot" style={{ marginTop: 20 }}><ButtonLink href="/contact?interest=Event%20participation#enquiry">Notify me</ButtonLink></div></div>}
          />
        </div>
      </section>

      {gallery.length > 0 && <section className="section-tight"><Gallery images={gallery} /></section>}

      <section className="section bg-navy">
        <div className="container">
          <SectionHead center eyebrow="Our footprint" title="By the numbers." />
          <Stagger className="stats-band">
            {[['500+', 'Experiences hosted'], ['5,000+', 'Professionals engaged'], ['250+', 'Industry speakers'], ['40+', 'Partner organisations']].map(([n, l]) => <StaggerItem key={l}><strong><CountUp value={n!} /></strong><h3>{l}</h3></StaggerItem>)}
          </Stagger>
        </div>
      </section>

      <CtaBanner image={banner} eyebrow="Co-create with IFF" title={<>Let’s create meaningful <em>industry experiences.</em></>} text="Collaborate with IFF to bring together professionals, leaders and organisations across the BFSI ecosystem." actions={<ButtonLink href="/contact?interest=Sponsorship#enquiry" variant="gold">Partner with IFF</ButtonLink>} />
    </>
  )
}
