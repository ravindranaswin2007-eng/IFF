'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { startTransition, useActionState, useEffect, useRef, useState, type ReactNode, type ComponentType } from 'react'
import { ArrowRight, ShieldCheck, Upload, CheckCircle2, AlertCircle, Users, Landmark, Network, BookOpen, Sparkles, Globe, Briefcase, Mic, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitEnquiry, type FormState } from '@/app/(frontend)/actions'

export type Destination = string

export function Action({ children, to = '/contact', secondary = false }: { children: ReactNode; to?: Destination; secondary?: boolean }) {
  const pathname = usePathname()
  return <Button asChild size="lg" variant={secondary ? 'secondary' : 'default'}><Link href={to} onClick={e => { const path = to.split(/[?#]/)[0]; const target = path === '/job-seekers' ? 'profile' : path === '/speaking' ? 'application' : path === '/contact' ? 'contact-form' : undefined; if (target && pathname === path) { e.preventDefault(); document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }); } }}>{children}<ArrowRight /></Link></Button>
}
export function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><span />{children}</div> }
export function Section({ children, title, eyebrow, description, blue = false, centered = false, id }: { children?: ReactNode; title?: string; eyebrow?: string; description?: string; blue?: boolean; centered?: boolean; id?: string }) { return <section id={id} className={`section ${blue ? 'section-blue' : ''}`}><div className="container">{title && <div className={`section-heading ${centered ? 'centered' : ''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{description && <p>{description}</p>}</div>}{children}</div></section> }
// eslint-disable-next-line @next/next/no-img-element
export function Hero({ eyebrow, title, description, image, caption, action = 'Become a Member', to = '/contact', stats, children, dark = false }: { eyebrow: string; title: ReactNode; description: string; image?: string; caption?: string; action?: string; to?: Destination; stats?: [string, string][]; children?: ReactNode; dark?: boolean }) { return <section className={`page-hero ${dark ? 'hero-dark' : ''} ${image ? 'has-image' : ''}`}><div className="container hero-grid"><div className="hero-copy"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{description}</p>{(action || children) && <div className="hero-buttons">{action && <Action to={to}>{action}</Action>}{children}</div>}{stats && <Stats items={stats} compact />}</div>{image && <figure className="hero-photo"><img src={image} alt={caption || 'Financial leaders in conversation'} /><figcaption><span className="photo-icon"><Network size={19} /></span><div><strong>{caption}</strong><small>Connecting India’s financial leadership</small></div></figcaption></figure>}</div></section> }
export function Stats({ items, compact = false, animated = false }: { items: [string, string][]; compact?: boolean; animated?: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(animated ? 0 : 1)
  useEffect(() => {
    const element = container.current
    if (!animated || !element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const finish = () => { cancelAnimationFrame(frame); setProgress(1) }
    if (motion.matches || !('IntersectionObserver' in window)) { finish(); return }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / 1600, 1)
        setProgress(1 - Math.pow(1 - elapsed, 3))
        if (elapsed < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    observer.observe(element)
    const onMotionChange = () => { if (motion.matches) { observer.disconnect(); finish() } }
    motion.addEventListener('change', onMotionChange)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); motion.removeEventListener('change', onMotionChange) }
  }, [animated])
  return <div ref={container} className={`${compact ? 'stats compact-stats' : 'stats'}${animated ? ' animated-stats' : ''}`}>{items.map(([value, label]) => {
    const match = value.match(/^([\d,]+)(.*)$/)
    const displayed = animated && match ? `${Math.round(Number((match[1] || '').replaceAll(',', '')) * progress).toLocaleString('en-US')}${match[2] || ''}` : value
    return <div key={label}><strong aria-label={animated ? value : undefined}><span aria-hidden={animated ? true : undefined}>{displayed}</span></strong><span>{label}</span></div>
  })}</div>
}
const icons = [Landmark, Users, Network, TrendingUp, Briefcase, ShieldCheck, BookOpen, Globe, Sparkles, Mic]
export function FeatureGrid({ items, columns = 3 }: { items: { title: string; text: string; link?: string; to?: Destination; icon?: ComponentType<{ size?: number }> }[]; columns?: number }) { return <div className={`feature-grid columns-${columns}`}>{items.map((item, i) => { const Icon = item.icon || icons[i % icons.length] || Landmark; return <article className="feature-card" key={item.title}><div className={`feature-icon tone-${i % 4}`}><Icon size={22} /></div><h3>{item.title}</h3><p>{item.text}</p>{item.link && <Link className="text-link" href={item.to || '/contact'}>{item.link}<ArrowRight size={16} /></Link>}</article> })}</div> }
export const defaultPartners = ['SBI', 'HDFC BANK', 'ICICI BANK', 'AXIS BANK', 'Kotak', 'BAJAJ FINSERV', 'Adani']
export function Partners({ names = defaultPartners }: { names?: string[] }) { return <div className="partners">{names.map(name => <span key={name}>{name}</span>)}</div> }
export function Callout({ title = 'Ready to be part of what’s next?', text = 'Join India’s financial community to connect, collaborate and create meaningful impact.', action = 'Become a Member', to = '/contact' }: { title?: string; text?: string; action?: string; to?: Destination }) { return <section className="section"><div className="container callout"><div><Eyebrow>JOIN IFF</Eyebrow><h2>{title}</h2><p>{text}</p><Action to={to}>{action}</Action></div><Network className="callout-mark" size={190} strokeWidth={0.5} /></div></section> }

const contactInterests = ['Membership', 'Institutional Partnership', 'Executive Roundtables', 'Speaking Opportunities', 'Other']
const successMessage = { contact: 'Thank you — your details have been received. The IFF team will be in touch shortly.', career: 'Thank you — your profile has been received. We’ll reach out when a relevant opportunity or introduction comes up.', speaker: 'Thank you for applying. Our programming team reviews every application and will be in touch.' }

/** The client's application form, submitting to the site's enquiry storage. */
export function ApplicationForm({ kind = 'contact', defaultInterest, event, sourcePage }: { kind?: 'contact' | 'career' | 'speaker'; defaultInterest?: string; event?: string; sourcePage?: string }) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(submitEnquiry, { status: 'idle' })
  const [file, setFile] = useState('')
  const form = useRef<HTMLFormElement>(null)
  const careerForm = kind === 'career', speaker = kind === 'speaker'
  const fields: [string, string][] = speaker
    ? [['Name', 'name'], ['Organisation', 'organisation'], ['Designation', 'designation'], ['Work Email', 'email'], ['LinkedIn Profile', 'linkedin'], ['Areas of Expertise', 'interest']]
    : careerForm
      ? [['Name', 'name'], ['Current Organisation', 'organisation'], ['Current Designation', 'designation'], ['Work Email', 'email'], ['LinkedIn Profile', 'linkedin']]
      : [['Full Name', 'name'], ['Organisation', 'organisation'], ['Work Email', 'email']]
  const optional = (label: string) => label === 'LinkedIn Profile' && careerForm
  const required = [...fields.filter(([label]) => !optional(label)).map(([, name]) => name), ...(kind === 'contact' ? ['interest'] : []), ...(speaker ? ['message'] : [])].join(',')
  useEffect(() => { if (state.status === 'success') { form.current?.reset(); setFile('') } }, [state])
  const errors = state.errors ? Object.values(state.errors) : []
  return <form ref={form} className="application-form" onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); startTransition(() => dispatch(data)) }}>
    <input type="hidden" name="kind" value={kind} /><input type="hidden" name="required" value={required} />{event && <input type="hidden" name="event" value={event} />}{sourcePage && <input type="hidden" name="sourcePage" value={sourcePage} />}<input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: 'absolute', left: -10000, width: 1, height: 1 }} />
    <div className="form-grid">{fields.map(([label, name], i) => <label key={label} className={i === 4 && fields.length === 5 ? 'full-field' : ''}>{label} {optional(label) ? <small>(Optional)</small> : <span className="required">*</span>}<input name={name} required={!optional(label)} type={label.includes('Email') ? 'email' : label.includes('LinkedIn') ? 'url' : 'text'} placeholder={label.includes('Email') ? 'name@institution.com' : label.includes('LinkedIn') ? 'https://www.linkedin.com/in/yourprofile' : `Enter your ${label.toLowerCase()}`} /></label>)}{kind === 'contact' && <label>What would you like to explore? <span className="required">*</span><select name="interest" required defaultValue={defaultInterest && contactInterests.includes(defaultInterest) ? defaultInterest : ''}><option value="" disabled>Select an option</option>{contactInterests.map(x => <option key={x}>{x}</option>)}</select></label>}{speaker && <label className="full-field">Previous Speaking Experience <small>(Optional)</small><textarea name="experience" placeholder="Share past speaking engagements, panels or thought leadership contributions." /></label>}<label className="full-field">{speaker ? 'Short Bio' : 'Brief Note / Message'} {speaker ? <span className="required">*</span> : <small>(Optional)</small>}<textarea name="message" required={speaker} rows={4} placeholder={speaker ? 'Tell us about your professional background, achievements and areas of interest.' : 'Please mention any specific agenda, timeline, or objectives…'} /></label>{careerForm && <label className="full-field">Upload Resume <span className="required">*</span><span className="upload-field"><Upload size={25} /><span>{file || 'Click to upload your resume'}<small>PDF, DOC or DOCX</small></span><input aria-label="Upload Resume" name="resume" type="file" required accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files?.[0]?.name || '')} /></span></label>}</div>
    <div className="form-bottom"><Button type="submit" size="lg" disabled={pending}>{pending ? 'Sending…' : speaker ? 'Submit Application' : careerForm ? 'Submit Profile' : 'Let’s Connect'}<ArrowRight /></Button><span><ShieldCheck size={15} />Your details are treated confidentially.</span></div>
    {state.status === 'success' && <div className="form-notice" role="status"><CheckCircle2 size={20} />{successMessage[kind]}</div>}
    {state.status === 'error' && <div className="form-notice" role="alert"><AlertCircle size={20} /><span>{state.message}{errors.length > 0 && <> {errors.join(' ')}</>}</span></div>}
  </form>
}

export type EventItem = { key: string | number; title: string; category: string; text: string; image: string; href: string; external?: boolean }
// eslint-disable-next-line @next/next/no-img-element
export function EventsGrid({ events, limit = 4 }: { events: EventItem[]; limit?: number }) { const [filter, setFilter] = useState('All'); return <><div className="filter-tabs" role="group" aria-label="Event categories">{['All', 'Roundtables', 'Webinars', 'Networking'].map(x => <Button key={x} size="sm" variant={filter === x ? 'default' : 'ghost'} onClick={() => setFilter(x)}>{x}</Button>)}</div><div className="event-grid">{events.filter(e => filter === 'All' || e.category === filter).slice(0, limit).map(e => <article className="event-card" key={e.key}><img src={e.image} alt={e.title} /><div><span className="eyebrow">{e.category}</span><h3>{e.title}</h3><p>{e.text}</p><Link href={e.href} className="text-link" {...(e.external ? { target: '_blank', rel: 'noreferrer' } : {})}>Express Interest <ArrowRight size={15} /></Link></div></article>)}</div></> }

export type InsightItem = { key: string | number; category: string; title: string; text: string; href?: string }
export function Insights({ items }: { items: InsightItem[] }) { const [selected, setSelected] = useState<number | null>(null); return <><div className="feature-grid columns-3">{items.map((item, i) => <article className="feature-card insight-card" key={item.key}><Eyebrow>{item.category}</Eyebrow><h3>{item.title}</h3><p>{item.text}</p>{item.href ? <Button asChild variant="link"><Link href={item.href}>Read Perspective <ArrowRight /></Link></Button> : <Button variant="link" onClick={() => setSelected(i)}>Read Perspective <ArrowRight /></Button>}</article>)}</div>{selected !== null && <div className="article-expanded" role="region" aria-label="Selected perspective"><Eyebrow>{items[selected]?.category}</Eyebrow><h2>{items[selected]?.title}</h2><p>{items[selected]?.text}</p><p>The full publication was not included in the shared design.</p><Button variant="outline" onClick={() => setSelected(null)}>Close perspective</Button></div>}</> }
