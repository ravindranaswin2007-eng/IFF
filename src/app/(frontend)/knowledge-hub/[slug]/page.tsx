import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CalendarDays, Clock, Download, FileText, UserRound } from 'lucide-react'
import { PostCard, postTypeLabel } from '@/components/cards'
import { gridFor } from '@/lib/grid'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { ButtonLink, CtaBanner, Hero, Img, SectionHead } from '@/components/ui'
import { formatDate } from '@/lib/media'
import { asMedia, getPageImages, getPost, getPosts } from '@/lib/payload'
import type { Document } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  const cover = asMedia(post.cover)
  return { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: 'article', images: cover?.url ? [cover.url] : undefined } }
}

/** Turns YouTube / Vimeo / Spotify share links into embeddable player URLs. */
function toEmbed(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
    if (u.hostname.includes('youtube.com')) { const id = u.searchParams.get('v') ?? u.pathname.split('/').pop(); return `https://www.youtube-nocookie.com/embed/${id}` }
    if (u.hostname.includes('vimeo.com') && !u.hostname.startsWith('player')) return `https://player.vimeo.com/video/${u.pathname.split('/').filter(Boolean).pop()}`
    if (u.hostname === 'open.spotify.com' && !u.pathname.startsWith('/embed')) return `https://open.spotify.com/embed${u.pathname}`
    return url
  } catch { return null }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = await getPost(slug, draft)
  if (!post) notFound()
  const [{ banner }, related] = await Promise.all([getPageImages('knowledgeHub'), getPosts({ type: post.type, limit: 4 })])
  const cover = asMedia(post.cover)
  const file = post.file && typeof post.file === 'object' ? (post.file as Document) : null
  const embed = post.embedUrl ? toEmbed(post.embedUrl) : null
  const more = related.filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <>
      <Hero className="article-hero" breadcrumb="Knowledge Hub" eyebrow={postTypeLabel[post.type] ?? 'Insight'} title={post.title} lead={post.excerpt} actions={
        <div className="meta-row">
          {post.author && <span><UserRound />{post.author}{post.authorRole ? `, ${post.authorRole}` : ''}</span>}
          {post.publishedAt && <span><CalendarDays />{formatDate(post.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          {post.duration && <span><Clock />{post.duration}</span>}
        </div>
      } />
      {cover && <Reveal className="article-cover"><Img media={cover} size="wide" priority sizes="(max-width: 1040px) 100vw, 1040px" /></Reveal>}
      <section className={cover ? 'section-tight' : 'section'} style={cover ? { paddingTop: 0 } : undefined}>
        <article className="container article">
          {embed && <div className="embed"><iframe src={embed} title={post.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>}
          {file?.url && file.mimeType?.startsWith('audio/') && <audio controls preload="none" src={file.url} />}
          {file?.url && !file.mimeType?.startsWith('audio/') && (
            <div className="download-card"><div><FileText />{file.title || file.filename}</div><a className="btn btn-sm" href={file.url} download><Download />Download</a></div>
          )}
          {post.content && <Reveal className="prose"><RichText data={post.content} /></Reveal>}
        </article>
      </section>
      {more.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <SectionHead eyebrow="Keep reading" title={`More ${postTypeLabel[post.type]?.toLowerCase()}s`}><div style={{ marginTop: 20 }}><ButtonLink href="/knowledge-hub" variant="outline">All insights</ButtonLink></div></SectionHead>
            <Stagger className={gridFor(more.length)}>{more.map((p) => <StaggerItem key={p.id}><PostCard post={p} /></StaggerItem>)}</Stagger>
          </div>
        </section>
      )}
      <CtaBanner image={banner} eyebrow="Contribute" title={<>Have a perspective worth <em>sharing?</em></>} text="Write, speak or record with the IFF community." actions={<ButtonLink href="/speaking#apply" variant="gold">Contribute</ButtonLink>} />
    </>
  )
}
