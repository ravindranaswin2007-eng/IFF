import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Newspaper, Video } from 'lucide-react';
import { Callout, Eyebrow, Hero, Section, photos } from '@/components/iff';
import { pageHead } from '@/lib/site';

export const Route = createFileRoute('/knowledge-hub')({
  head: () => pageHead('Knowledge Hub', 'Blogs and webinars from the Indian Financial Forum community.'),
  component: Knowledge,
});

type ContentType = 'Blogs' | 'Webinars';

const typeIcons = { Blogs: Newspaper, Webinars: Video } as const;
const thumbnails = {
  Blogs: [photos.career, photos.conversation, photos.dialogue, photos.community],
  Webinars: [photos.roundtable, photos.summit, photos.highlight, photos.dialogue],
};

const content: { type: ContentType; title: string; text: string; meta: string }[] = [
  { type: 'Blogs', title: 'The next phase of digital lending in India', text: 'How responsible innovation and evolving regulation are reshaping credit.', meta: '6 min read' },
  { type: 'Blogs', title: 'Building future-ready BFSI talent', text: 'The skills and leadership that will define the next generation of finance professionals.', meta: '5 min read' },
  { type: 'Blogs', title: 'Blog 03', text: 'More perspectives from the IFF community coming soon.', meta: 'Upcoming blog' },
  { type: 'Blogs', title: 'Blog 04', text: 'More perspectives from the IFF community coming soon.', meta: 'Upcoming blog' },
  { type: 'Webinars', title: 'Digital Lending & FLDG Masterclass', text: 'Decoding digital lending guidelines and first-loss default guarantee frameworks.', meta: '60 min session' },
  { type: 'Webinars', title: 'Treasury & Liquidity Management', text: 'Fresh perspectives on liquidity strategy and financial resilience.', meta: '45 min session' },
  { type: 'Webinars', title: 'Webinar 03', text: 'More conversations with financial leaders coming soon.', meta: 'Upcoming webinar' },
  { type: 'Webinars', title: 'Webinar 04', text: 'More conversations with financial leaders coming soon.', meta: 'Upcoming webinar' },
];

const sections: ContentType[] = ['Blogs', 'Webinars'];

function Knowledge() {
  return <>
    <Hero
      eyebrow="KNOWLEDGE HUB"
      action=""
      title={<>Ideas and insights from<br />the <em>BFSI</em> community.</>}
      description="Explore blogs and webinars created with India’s financial leaders."
    />
    {sections.map(type => <Section key={type} title={type}>
      <div className="knowledge-grid">
        {content.filter(item => item.type === type).map((item, index) => {
          const Icon = typeIcons[item.type];
          return <article className="feature-card knowledge-card" key={item.title}>
            <img className="knowledge-thumbnail" src={thumbnails[item.type][index]} alt={`Placeholder thumbnail for ${item.title}`} width={640} height={360} loading="lazy" />
            <div className="knowledge-card-top"><Eyebrow>{item.type}</Eyebrow><Icon size={20} aria-hidden /></div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span className="knowledge-meta">{item.meta}</span>
            <span className="text-link" aria-disabled="true">Coming soon <ArrowRight size={16} /></span>
          </article>;
        })}
      </div>
    </Section>)}
    <Callout title="Bring your perspective to the conversation." text="Share your expertise with the IFF community through a blog or webinar." action="Contribute Your Expertise" to="/speaking" />
  </>;
}
