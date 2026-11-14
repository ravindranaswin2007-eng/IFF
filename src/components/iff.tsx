import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode, type ComponentType } from 'react';
import { ArrowRight, ShieldCheck, Upload, CheckCircle2, Users, Landmark, Network, BookOpen, Sparkles, Globe, Briefcase, MessageSquare, Mic, CalendarDays, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import career from '@/assets/career-meeting.jpg.asset.json';
import conversation from '@/assets/career-conversation.jpg.asset.json';
import dialogue from '@/assets/leadership-dialogue.jpg.asset.json';
import roundtable from '@/assets/executive-roundtable.jpg.asset.json';
import summit from '@/assets/leadership-summit.jpg.asset.json';
import community from '@/assets/financial-community.jpg.asset.json';
import highlight from '@/assets/event-highlight.jpg.asset.json';

export const photos = { career: career.url, conversation: conversation.url, dialogue: dialogue.url, roundtable: roundtable.url, summit: summit.url, community: community.url, highlight: highlight.url };
export type Destination = '/' | '/about' | '/professionals' | '/organisations' | '/events' | '/knowledge-hub' | '/job-seekers' | '/contact' | '/speaking';
export function Action({ children, to = '/contact', secondary = false }: { children: ReactNode; to?: Destination; secondary?: boolean }) { return <Button asChild size="lg" variant={secondary ? 'secondary' : 'default'}><Link to={to} onClick={e => { const target = to === '/job-seekers' ? 'profile' : to === '/speaking' ? 'application' : to === '/contact' ? 'contact-form' : undefined; if (target && window.location.pathname === to) { e.preventDefault(); document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }); } }}>{children}<ArrowRight /></Link></Button>; }
export function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><span />{children}</div>; }
export function Section({ children, title, eyebrow, description, blue = false, centered = false, id }: { children?: ReactNode; title?: string; eyebrow?: string; description?: string; blue?: boolean; centered?: boolean; id?: string }) { return <section id={id} className={`section ${blue ? 'section-blue' : ''}`}><div className="container">{title && <div className={`section-heading ${centered ? 'centered' : ''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{description && <p>{description}</p>}</div>}{children}</div></section>; }
export function Hero({ eyebrow, title, description, image, caption, action = 'Become a Member', to = '/contact', stats, children, dark = false }: { eyebrow: string; title: ReactNode; description: string; image?: string; caption?: string; action?: string; to?: Destination; stats?: [string, string][]; children?: ReactNode; dark?: boolean }) { return <section className={`page-hero ${dark ? 'hero-dark' : ''} ${image ? 'has-image' : ''}`}><div className="container hero-grid"><div className="hero-copy"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p>{(action || children) && <div className="hero-buttons">{action && <Action to={to}>{action}</Action>}{children}</div>}{stats && <Stats items={stats} compact />}</div>{image && <figure className="hero-photo"><img src={image} alt={caption || 'Financial leaders in conversation'} /><figcaption><span className="photo-icon"><Network size={19} /></span><div><strong>{caption}</strong><small>Connecting India’s financial leadership</small></div></figcaption></figure>}</div></section>; }
export function Stats({ items, compact = false, animated = false }: { items: [string, string][]; compact?: boolean; animated?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(animated ? 0 : 1);
  useEffect(() => {
    const element = container.current;
    if (!animated || !element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const finish = () => { cancelAnimationFrame(frame); setProgress(1); };
    if (motion.matches || !('IntersectionObserver' in window)) { finish(); return; }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / 1600, 1);
        setProgress(1 - Math.pow(1 - elapsed, 3));
        if (elapsed < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    observer.observe(element);
    const onMotionChange = () => { if (motion.matches) { observer.disconnect(); finish(); } };
    motion.addEventListener('change', onMotionChange);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); motion.removeEventListener('change', onMotionChange); };
  }, [animated]);
  return <div ref={container} className={`${compact ? 'stats compact-stats' : 'stats'}${animated ? ' animated-stats' : ''}`}>{items.map(([value, label]) => {
    const match = value.match(/^([\d,]+)(.*)$/);
    const displayed = animated && match ? `${Math.round(Number((match[1] || '').replaceAll(',', '')) * progress).toLocaleString('en-US')}${match[2] || ''}` : value;
    return <div key={label}><strong aria-label={animated ? value : undefined}><span aria-hidden={animated ? true : undefined}>{displayed}</span></strong><span>{label}</span></div>;
  })}</div>;
}
const icons = [Landmark, Users, Network, TrendingUp, Briefcase, ShieldCheck, BookOpen, Globe, Sparkles, Mic];
export function FeatureGrid({ items, columns = 3 }: { items: { title: string; text: string; link?: string; to?: Destination; icon?: ComponentType<{ size?: number }> }[]; columns?: number }) { return <div className={`feature-grid columns-${columns}`}>{items.map((item, i) => { const Icon = item.icon || icons[i % icons.length] || Landmark; return <article className="feature-card" key={item.title}><div className={`feature-icon tone-${i % 4}`}><Icon size={22} /></div><h3>{item.title}</h3><p>{item.text}</p>{item.link && <Link className="text-link" to={item.to || '/contact'}>{item.link}<ArrowRight size={16} /></Link>}</article>; })}</div>; }
export function Partners() { return <div className="partners">{['SBI', 'HDFC BANK', 'ICICI BANK', 'AXIS BANK', 'Kotak', 'BAJAJ FINSERV', 'Adani'].map(name => <span key={name}>{name}</span>)}</div>; }
export function Callout({ title = 'Ready to be part of what’s next?', text = 'Join India’s financial community to connect, collaborate and create meaningful impact.', action = 'Become a Member', to = '/contact' }: { title?: string; text?: string; action?: string; to?: Destination }) { return <section className="section"><div className="container callout"><div><Eyebrow>JOIN IFF</Eyebrow><h2>{title}</h2><p>{text}</p><Action to={to}>{action}</Action></div><Network className="callout-mark" size={190} strokeWidth={0.5} /></div></section>; }
export function ApplicationForm({ kind = 'contact' }: { kind?: 'contact' | 'career' | 'speaker' }) {
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState('');
  const careerForm = kind === 'career', speaker = kind === 'speaker';
  const fields = speaker ? ['Name', 'Organisation', 'Designation', 'LinkedIn Profile', 'Areas of Expertise'] : careerForm ? ['Name', 'Current Organisation', 'Current Designation', 'Work Email', 'LinkedIn Profile'] : ['Full Name', 'Organisation', 'Work Email'];
  return <form className="application-form" onSubmit={e => { e.preventDefault(); setReady(true); }}><div className="form-grid">{fields.map((label, i) => <label key={label} className={i === 4 ? 'full-field' : ''}>{label} {label === 'LinkedIn Profile' && careerForm ? <small>(Optional)</small> : <span className="required">*</span>}<input name={label} required={!(label === 'LinkedIn Profile' && careerForm)} type={label.includes('Email') ? 'email' : label.includes('LinkedIn') ? 'url' : 'text'} placeholder={label.includes('Email') ? 'name@institution.com' : label.includes('LinkedIn') ? 'https://www.linkedin.com/in/yourprofile' : `Enter your ${label.toLowerCase()}`} /></label>)}{kind === 'contact' && <label>What would you like to explore? <span className="required">*</span><select required defaultValue=""><option value="" disabled>Select an option</option>{['Membership', 'Institutional Partnership', 'Executive Roundtables', 'Speaking Opportunities', 'Career Connections', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label>}{speaker && <label className="full-field">Previous Speaking Experience <small>(Optional)</small><textarea placeholder="Share past speaking engagements, panels or thought leadership contributions." /></label>}<label className="full-field">{speaker ? 'Short Bio' : 'Brief Note / Message'} {speaker ? <span className="required">*</span> : <small>(Optional)</small>}<textarea required={speaker} rows={4} placeholder={speaker ? 'Tell us about your professional background, achievements and areas of interest.' : 'Please mention any specific agenda, timeline, or objectives…'} /></label>{careerForm && <label className="full-field">Upload Resume <span className="required">*</span><span className="upload-field"><Upload size={25} /><span>{file || 'Click to upload your resume'}<small>PDF, DOC or DOCX</small></span><input aria-label="Upload Resume" type="file" required accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0]?.name || '')} /></span></label>}</div><div className="form-bottom"><Button type="submit" size="lg">{speaker ? 'Submit Application' : careerForm ? 'Submit Profile' : 'Let’s Connect'}<ArrowRight /></Button><span><ShieldCheck size={15} />Your details are treated confidentially.</span></div>{ready && <div className="form-notice" role="status"><CheckCircle2 size={20} />Your details are ready. Online submissions are not connected yet; nothing has been sent.</div>}</form>;
}
export const eventList = [
  { title: 'IFF Risk & Compliance Roundtable', category: 'Roundtables', text: 'Managing systemic liquidity pressures, cyber exposure and evolving regulation.', image: photos.roundtable },
  { title: 'Digital Lending & FLDG Masterclass', category: 'Webinars', text: 'Decoding credit, digital lending guidelines and responsible innovation.', image: photos.career },
  { title: 'Women in BFSI Leadership Assembly', category: 'Networking', text: 'Connecting leaders and celebrating the perspectives shaping finance.', image: photos.community },
  { title: 'Treasury & Liquidity Management', category: 'Roundtables', text: 'Fresh perspectives on liquidity strategy and financial resilience.', image: photos.roundtable },
];
export function EventsGrid({ limit = 4 }: { limit?: number }) { const [filter, setFilter] = useState('All'); return <><div className="filter-tabs" role="group" aria-label="Event categories">{['All', 'Roundtables', 'Webinars', 'Networking'].map(x => <Button key={x} size="sm" variant={filter === x ? 'default' : 'ghost'} onClick={() => setFilter(x)}>{x}</Button>)}</div><div className="event-grid">{eventList.filter(e => filter === 'All' || e.category === filter).slice(0, limit).map(e => <article className="event-card" key={e.title}><img src={e.image} alt={e.title} /><div><span className="eyebrow">{e.category}</span><h3>{e.title}</h3><p>{e.text}</p><Link to="/contact" className="text-link">Express Interest <ArrowRight size={15} /></Link></div></article>)}</div></>; }
export const insights = [
  { category: 'COMMENTARY', title: 'The next phase of digital lending in India', text: 'How institutional collaboration, responsible innovation and evolving regulation are shaping the future of credit.' },
  { category: 'INSIGHT', title: 'Building future-ready BFSI talent', text: 'A perspective on the skills, leadership and connections that will shape the next generation of financial professionals.' },
  { category: 'PERSPECTIVE', title: 'What’s next for India’s financial sector?', text: 'Exploring opportunities and priorities for banking, insurance, asset management and fintech.' },
];
export function Insights() { const [selected, setSelected] = useState<number | null>(null); return <><div className="feature-grid columns-3">{insights.map((item, i) => <article className="feature-card insight-card" key={item.title}><Eyebrow>{item.category}</Eyebrow><h3>{item.title}</h3><p>{item.text}</p><Button variant="link" onClick={() => setSelected(i)}>Read Perspective <ArrowRight /></Button></article>)}</div>{selected !== null && <div className="article-expanded" role="region" aria-label="Selected perspective"><Eyebrow>{insights[selected]?.category}</Eyebrow><h2>{insights[selected]?.title}</h2><p>{insights[selected]?.text}</p><p>The full publication was not included in the shared design.</p><Button variant="outline" onClick={() => setSelected(null)}>Close perspective</Button></div>}</>; }