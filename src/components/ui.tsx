import Link from 'next/link'
import { ArrowRight, Network } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import type { Media } from '@/payload-types'
import { imageProps } from '@/lib/media'
import { CountUp, HeroLine, HeroMedia, HeroText, Parallax, Reveal } from './motion'

export function Img({ media, size = 'wide', className, priority, sizes = '100vw' }: { media?: Media | null; size?: 'thumb' | 'card' | 'wide' | 'xl'; className?: string; priority?: boolean; sizes?: string }) {
  const props = imageProps(media, size)
  if (!props) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} sizes={sizes} className={className} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
}

/** Shows the photo, or a branded graphic until a real photograph is uploaded. */
export function MediaOrFallback({ media, icon: Icon = Network, size = 'card', sizes }: { media?: Media | null; icon?: ComponentType<{ size?: number }>; size?: 'thumb' | 'card' | 'wide' | 'xl'; sizes?: string }) {
  return media?.url ? <Img media={media} size={size} sizes={sizes} /> : <div className="media-fallback" aria-hidden><Icon /></div>
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <span className={`eyebrow${light ? ' light' : ''}`}>{children}</span>
}

export function ButtonLink({ href, children, variant = 'primary', className = '' }: { href: string; children: ReactNode; variant?: 'primary' | 'gold' | 'light' | 'ghost' | 'outline'; className?: string }) {
  const cls = variant === 'primary' ? 'btn' : `btn btn-${variant}`
  return <Link href={href} className={`${cls} ${className}`}>{children}<ArrowRight /></Link>
}

export function SectionHead({ eyebrow, title, lead, center, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; center?: boolean; children?: ReactNode }) {
  return (
    <Reveal className={`section-head${center ? ' center' : ''}`}>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="h2">{title}</h2>
      </div>
      {(lead || children) && <div>{lead && <p className="lead">{lead}</p>}{children}</div>}
    </Reveal>
  )
}

export function Hero({ eyebrow, title, lead, image, actions, stats, home, breadcrumb, className = '' }: {
  eyebrow: string; title: ReactNode; lead?: ReactNode; image?: Media | null; actions?: ReactNode; stats?: [string, string][]; home?: boolean; breadcrumb?: string; className?: string
}) {
  return (
    <section className={`hero${home ? ' hero-home' : ''} ${className}`}>
      {image?.url ? (
        <HeroMedia className="hero-media"><Img media={image} size="xl" priority /></HeroMedia>
      ) : (
        <div className="hero-fallback" aria-hidden />
      )}
      <div className="container">
        <HeroText className="hero-content">
          {breadcrumb && <HeroLine><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">{breadcrumb}</span></nav></HeroLine>}
          <HeroLine><Eyebrow light>{eyebrow}</Eyebrow></HeroLine>
          <HeroLine><h1 className="h1">{title}</h1></HeroLine>
          {lead && <HeroLine><p className="lead">{lead}</p></HeroLine>}
          {actions && <HeroLine><div className="btn-row">{actions}</div></HeroLine>}
          {stats && (
            <HeroLine>
              <div className="hero-stats">{stats.map(([v, l]) => <div key={l}><strong><CountUp value={v} /></strong><span>{l}</span></div>)}</div>
            </HeroLine>
          )}
        </HeroText>
      </div>
      {home && <div className="hero-scroll" aria-hidden>Scroll<span /></div>}
    </section>
  )
}

/** Full-width photo banner that closes every page, right above the footer. */
export function CtaBanner({ eyebrow = 'Join IFF', title, text, image, actions }: { eyebrow?: string; title: ReactNode; text: ReactNode; image?: Media | null; actions: ReactNode }) {
  return (
    <section className="cta-banner">
      {image?.url ? <Parallax className="bg"><Img media={image} size="wide" /></Parallax> : <div className="hero-fallback" aria-hidden style={{ zIndex: -2 }} />}
      <div className="container">
        <Reveal className="content">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h2 className="h2">{title}</h2>
          <p>{text}</p>
          <div className="btn-row">{actions}</div>
        </Reveal>
      </div>
    </section>
  )
}

export function FeatureCard({ icon: Icon, title, text, href, linkLabel, index }: { icon: ComponentType<{ size?: number }>; title: string; text: string; href?: string; linkLabel?: string; index?: number }) {
  const body = (
    <article className="card">
      {index !== undefined && <span className="card-num">{String(index + 1).padStart(2, '0')}</span>}
      <span className="icon-badge"><Icon /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {href && <span className="link-arrow">{linkLabel ?? 'Learn more'} <ArrowRight /></span>}
    </article>
  )
  return href ? <Link href={href} style={{ display: 'block', height: '100%' }}>{body}</Link> : body
}
