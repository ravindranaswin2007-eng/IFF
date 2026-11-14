import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Download } from 'lucide-react'
import { Callout, Hero, Section } from '@/components/iff'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/media'
import { getPost, mediaUrl } from '@/lib/payload'
import type { Document } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }
const labels: Record<string, string> = { blog: 'BLOG', report: 'REPORT', podcast: 'PODCAST', webinar: 'WEBINAR', news: 'NEWS' }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  return post ? { title: post.title, description: post.excerpt } : {}
}

/** Turns YouTube / Vimeo / Spotify share links into embeddable player URLs. */
function toEmbed(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
    if (u.hostname.includes('youtube.com')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v') ?? u.pathname.split('/').pop()}`
    if (u.hostname.includes('vimeo.com') && !u.hostname.startsWith('player')) return `https://player.vimeo.com/video/${u.pathname.split('/').filter(Boolean).pop()}`
    if (u.hostname === 'open.spotify.com' && !u.pathname.startsWith('/embed')) return `https://open.spotify.com/embed${u.pathname}`
    return url
  } catch { return null }
}

export default async function PostPage({ params }: Props) {
  const { isEnabled: draft } = await draftMode()
  const post = await getPost((await params).slug, draft)
  if (!post) notFound()
  const file = post.file && typeof post.file === 'object' ? (post.file as Document) : null
  const embed = post.embedUrl ? toEmbed(post.embedUrl) : null
  const meta = [post.author && `${post.author}${post.authorRole ? `, ${post.authorRole}` : ''}`, formatDate(post.publishedAt, { day: 'numeric', month: 'long', year: 'numeric' }), post.duration].filter(Boolean).join(' · ')
  return <>
    <Hero eyebrow={labels[post.type] ?? 'INSIGHT'} title={post.title} description={post.excerpt} image={mediaUrl(post.cover)} caption={meta || 'IFF Knowledge Hub'} action="" />
    <Section>
      <div className="form-width">
        {meta && <p className="knowledge-meta" style={{ display: 'block', marginBottom: 24 }}>{meta}</p>}
        {embed && <div style={{ position: 'relative', aspectRatio: '16 / 9', marginBottom: 32, borderRadius: 8, overflow: 'hidden' }}><iframe src={embed} title={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>}
        {file?.url && file.mimeType?.startsWith('audio/') && <audio controls preload="none" src={file.url} style={{ width: '100%', marginBottom: 32 }} />}
        {file?.url && !file.mimeType?.startsWith('audio/') && <div className="form-notice" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}><span>{file.title || file.filename}</span><Button asChild size="sm"><a href={file.url} download><Download />Download</a></Button></div>}
        {post.content && <div className="article-body"><RichText data={post.content} /></div>}
      </div>
    </Section>
    <Callout title="Bring your perspective to the conversation." text="Share your expertise with the IFF community through a blog or webinar." action="Contribute Your Expertise" to="/speaking" />
  </>
}
