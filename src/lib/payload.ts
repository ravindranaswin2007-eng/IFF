import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, SiteImage, SiteSetting } from '@/payload-types'
import type { PageKey } from '@/globals/SiteImages'
import { lovableLogo } from './default-photos'

export const payloadClient = cache(() => getPayload({ config }))

export const getSiteImages = cache(async (): Promise<SiteImage> => (await payloadClient()).findGlobal({ slug: 'site-images', depth: 1 }))
export const getSettings = cache(async (): Promise<SiteSetting> => {
  const settings = await (await payloadClient()).findGlobal({ slug: 'site-settings', depth: 1 })
  return { ...settings, logo: asMedia(settings.logo) ?? (lovableLogo as unknown as Media) }
})

export const asMedia = (value: unknown): Media | null => (value && typeof value === 'object' && 'url' in value ? (value as Media) : null)

/** URL of an uploaded image at a preferred size, or undefined when nothing is uploaded. */
export function mediaUrl(value: unknown, size: 'thumb' | 'card' | 'wide' | 'xl' = 'wide'): string | undefined {
  const m = asMedia(value)
  if (!m?.url) return undefined
  const sized = (m.sizes as Record<string, { url?: string | null } | undefined> | undefined)?.[size]?.url
  return sized || m.url
}

export async function getPageImages(page: PageKey) {
  const images = await getSiteImages()
  const group = images[page] as { hero?: unknown; banner?: unknown; feature?: unknown; summit?: unknown; gallery?: unknown[] | null } | undefined
  return { hero: asMedia(group?.hero), banner: asMedia(group?.banner), feature: asMedia(group?.feature), summit: asMedia(group?.summit), gallery: (group?.gallery ?? []).map(asMedia).filter(Boolean) as Media[] }
}

export async function getPosts({ type, limit = 24, featured }: { type?: string; limit?: number; featured?: boolean } = {}) {
  const payload = await payloadClient()
  const where: Record<string, unknown> = { _status: { equals: 'published' } }
  if (type) where.type = { equals: type }
  if (featured) where.featured = { equals: true }
  const result = await payload.find({ collection: 'posts', where: where as never, limit, sort: '-publishedAt', depth: 1, overrideAccess: false })
  return result.docs
}

export async function getPost(slug: string, draft = false) {
  const payload = await payloadClient()
  const result = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 2, draft, overrideAccess: draft })
  return result.docs[0] ?? null
}

export async function getEvents(limit = 50) {
  const payload = await payloadClient()
  const result = await payload.find({ collection: 'events', limit, sort: 'startDate', depth: 1 })
  return result.docs
}

export async function getPeople() {
  const payload = await payloadClient()
  const [leaders, volunteers] = await Promise.all([
    payload.find({ collection: 'leaders', limit: 100, sort: 'order', depth: 1 }),
    payload.find({ collection: 'volunteers', where: { active: { equals: true } }, limit: 300, sort: 'order', depth: 1 }),
  ])
  return { leaders: leaders.docs, volunteers: volunteers.docs }
}
