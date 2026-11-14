import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock, FileText, Headphones, Linkedin, MapPin, Mic, Newspaper, PlayCircle, Users } from 'lucide-react'
import type { Event, Leader, Media, Post, Volunteer } from '@/payload-types'
import { formatDate } from '@/lib/media'
import { MediaOrFallback } from './ui'

export const eventCategoryLabel: Record<string, string> = { summit: 'Flagship Summit', roundtable: 'Roundtable', webinar: 'Webinar', networking: 'Networking', weekly: 'Weekly Meeting' }
export const postTypeLabel: Record<string, string> = { blog: 'Blog', report: 'Report', podcast: 'Podcast', webinar: 'Webinar', news: 'News' }
const postIcons = { blog: Newspaper, report: FileText, podcast: Headphones, webinar: PlayCircle, news: Newspaper } as const
const eventIcons = { summit: Mic, roundtable: Users, webinar: PlayCircle, networking: Users, weekly: CalendarDays } as const

const media = (v: unknown) => (v && typeof v === 'object' ? (v as Media) : null)

export function interestHref(event: Pick<Event, 'slug' | 'registrationUrl'>) {
  return event.registrationUrl || `/contact?interest=event&event=${event.slug}#enquiry`
}

export function EventCard({ event }: { event: Event }) {
  const date = event.startDate ? new Date(event.startDate) : null
  const external = Boolean(event.registrationUrl)
  return (
    <article className="card media-card">
      <div className="media">
        <MediaOrFallback media={media(event.image)} icon={eventIcons[event.category] ?? Users} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <span className="tag-float">{eventCategoryLabel[event.category]}</span>
        {date && (
          <span className="date-chip">
            <strong>{formatDate(event.startDate, { day: 'numeric' })}</strong>
            <span>{formatDate(event.startDate, { month: 'short' })}</span>
          </span>
        )}
      </div>
      <div className="body">
        <h3>{event.title}</h3>
        <p>{event.summary}</p>
        <div className="meta">
          {event.city && <span><MapPin />{event.city}</span>}
          {event.format && <span><Users />{event.format}</span>}
          {!date && <span><CalendarDays />Date to be announced</span>}
        </div>
        <Link href={interestHref(event)} className="link-arrow" style={{ marginTop: 'auto', paddingTop: 22 }} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {external ? 'Register' : 'Express interest'} <ArrowRight />
        </Link>
      </div>
    </article>
  )
}

export function PostCard({ post }: { post: Post }) {
  const Icon = postIcons[post.type] ?? Newspaper
  return (
    <Link href={`/knowledge-hub/${post.slug}`} style={{ display: 'block', height: '100%' }}>
      <article className="card media-card">
        <div className="media">
          <MediaOrFallback media={media(post.cover)} icon={Icon} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          <span className="tag-float">{postTypeLabel[post.type]}</span>
        </div>
        <div className="body">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <div className="meta">
            {post.publishedAt && <span><CalendarDays />{formatDate(post.publishedAt)}</span>}
            {post.duration && <span><Clock />{post.duration}</span>}
          </div>
          <span className="link-arrow" style={{ marginTop: 'auto', paddingTop: 22 }}>{post.type === 'podcast' ? 'Listen' : post.type === 'webinar' ? 'Watch' : post.type === 'report' ? 'Read report' : 'Read'} <ArrowRight /></span>
        </div>
      </article>
    </Link>
  )
}

export function PersonCard({ person }: { person: Leader | Volunteer }) {
  const photo = media(person.photo)
  const initials = person.name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase()
  const role = [person.designation, person.organisation].filter(Boolean).join(', ')
  return (
    <article className="person">
      <div className="portrait">
        {photo?.url ? <MediaOrFallback media={photo} size="card" sizes="240px" /> : <span className="initials" aria-hidden>{initials}</span>}
        {person.linkedin && <a className="linkedin" href={person.linkedin} target="_blank" rel="noreferrer" aria-label={`${person.name} on LinkedIn`}><Linkedin size={17} /></a>}
      </div>
      <h3>{person.name}</h3>
      {role && <p>{role}</p>}
    </article>
  )
}
