import type { SiteSetting, Media } from '@/payload-types'

export function Marquee({ partners }: { partners: NonNullable<SiteSetting['partners']> }) {
  if (!partners.length) return null
  const list = partners.length < 6 ? [...partners, ...partners] : partners
  const row = (hidden?: boolean) => (
    <div style={{ display: 'flex' }} aria-hidden={hidden || undefined}>
      {list.map((p, i) => {
        const logo = p.logo && typeof p.logo === 'object' ? (p.logo as Media) : null
        return (
          <div className="marquee-item" key={`${p.id ?? p.name}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo?.url ? <img src={logo.url} alt={hidden ? '' : p.name} /> : p.name}
          </div>
        )
      })}
    </div>
  )
  return <div className="marquee"><div className="marquee-track">{row()}{row(true)}</div></div>
}

export function Gallery({ images }: { images: Media[] }) {
  if (!images.length) return null
  const row = (hidden?: boolean) => (
    <div style={{ display: 'flex', gap: 18 }} aria-hidden={hidden || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {images.map((m) => <figure key={m.url ?? m.id}><img src={(m.sizes as { card?: { url?: string } })?.card?.url || m.url || ''} alt={hidden ? '' : m.alt} loading="lazy" /></figure>)}
    </div>
  )
  return <section className="gallery-strip" aria-label="Event highlights" tabIndex={0}><div className="gallery-track">{row()}{row(true)}</div></section>
}
