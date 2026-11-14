import type { Metadata } from 'next'
import { PostCard, postTypeLabel } from '@/components/cards'
import { FilterGrid } from '@/components/explorers'
import { Reveal } from '@/components/motion'
import { ButtonLink, CtaBanner, Hero } from '@/components/ui'
import { getPageImages, getPosts } from '@/lib/payload'

export const metadata: Metadata = { title: 'Knowledge Hub', description: 'Blogs, reports, podcasts and webinars from the Indian Financial Forum community.' }

export default async function KnowledgeHub() {
  const [{ hero, banner }, posts] = await Promise.all([getPageImages('knowledgeHub'), getPosts({ limit: 200 })])
  return (
    <>
      <Hero image={hero} breadcrumb="Knowledge Hub" eyebrow="Knowledge Hub" title={<>Ideas and insights from the <em>BFSI</em> community.</>} lead="Blogs, reports, podcasts and webinars created with India’s financial leaders." />
      <section className="section">
        <div className="container">
          <Reveal>
            <FilterGrid
              label="Content type"
              items={posts.map((p) => ({ key: p.id, category: p.type, node: <PostCard post={p} /> }))}
              categories={Object.entries(postTypeLabel).map(([value, label]) => ({ value, label: `${label}s` }))}
              empty={<div className="empty-state"><h3>The first editions are being written.</h3><p>Subscribe to the Executive Dispatch in the footer to hear when new insights are published.</p></div>}
            />
          </Reveal>
        </div>
      </section>
      <CtaBanner image={banner} eyebrow="Contribute" title={<>Bring your perspective to the <em>conversation.</em></>} text="Share your expertise with the IFF community through a blog, report, podcast or webinar." actions={<ButtonLink href="/speaking#apply" variant="gold">Contribute your expertise</ButtonLink>} />
    </>
  )
}
