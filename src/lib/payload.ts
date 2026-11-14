import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, SiteImage, SiteSetting } from '@/payload-types'
import type { PageKey } from '@/globals/SiteImages'
import { defaultFeatureImages, defaultPageImages, lovableLogo } from './default-photos'

export const payloadClient = cache(() => getPayload({ config }))

/** Page photographs, with the interim Lovable photos filling any slot nobody has uploaded to yet. */
export const getSiteImages = cache(async (): Promise<SiteImage> => {
  const images = await (await payloadClient()).findGlobal({ slug: 'site-images', depth: 1 })
  const merged = { ...images } as Record<string, unknown>
  for (const [page, defaults] of Object.entries(defaultPageImages)) {
    const group = (images[page as PageKey] ?? {}) as { hero?: unknown; banner?: unknown }
    merged[page] = { ...group, hero: asMedia(group.hero) ?? defaults.hero, banner: asMedia(group.banner) ?? defaults.banner }
  }
  for (const key of ['summit', 'organisationsFeature', 'careersFeature', 'aboutStory'] as const) merged[key] = asMedia(images[key]) ?? defaultFeatureImages[key]
  const gallery = ((images.gallery ?? []) as unknown[]).map(asMedia).filter(Boolean)
  merged.gallery = gallery.length ? gallery : defaultFeatureImages.gallery
  return merged as unknown as SiteImage
})
export const getSettings = cache(async (): Promise<SiteSetting> => {
  const settings = await (await payloadClient()).findGlobal({ slug: 'site-settings', depth: 1 })
  return { ...settings, logo: asMedia(settings.logo) ?? lovableLogo }
})

export const asMedia = (value: unknown): Media | null => (value && typeof value === 'object' && 'url' in value ? (value as Media) : null)

export async function getPageImages(page: PageKey) {
  const images = await getSiteImages()
  const group = images[page] as { hero?: unknown; banner?: unknown } | undefined
  return { hero: asMedia(group?.hero), banner: asMedia(group?.banner), all: images }
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
