import type { Media } from '@/payload-types'

type SizeName = 'thumb' | 'card' | 'wide' | 'xl'

/** Build src/srcSet for a Payload image so the browser picks the right resolution. */
export function imageProps(media: Media | null | undefined, preferred: SizeName = 'wide') {
  if (!media?.url) return null
  const sizes = (media.sizes ?? {}) as Partial<Record<SizeName, { url?: string | null; width?: number | null }>>
  const entries = (Object.entries(sizes) as [SizeName, { url?: string | null; width?: number | null }][])
    .filter(([, s]) => s?.url && s.width)
    .sort((a, b) => (a[1].width ?? 0) - (b[1].width ?? 0))
  const src = sizes[preferred]?.url || media.url
  const srcSet = entries.length ? [...entries.map(([, s]) => `${s.url} ${s.width}w`), media.width ? `${media.url} ${media.width}w` : ''].filter(Boolean).join(', ') : undefined
  const focal = media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined
  return { src, srcSet, alt: media.alt || '', style: focal ? { objectPosition: focal } : undefined }
}

export function formatDate(value?: string | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!value) return null
  return new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: 'Asia/Kolkata' }).format(new Date(value))
}
