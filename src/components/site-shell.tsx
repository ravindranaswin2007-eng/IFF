'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState, useState } from 'react'
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navigation } from '@/lib/site'
import { subscribe, type FormState } from '@/app/(frontend)/actions'

export function Logo({ inverse = false, src }: { inverse?: boolean; src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <Link href="/" aria-label="Indian Financial Forum home" className={`logo ${inverse ? 'logo-inverse' : ''}`}><img src={src} alt="Indian Financial Forum" width={145} height={50} /></Link>
}

export function Header({ logo }: { logo: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const active = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? 'active' : undefined)
  return <header className="site-header"><div className="header-inner"><Logo src={logo} /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <Link key={item.href} href={item.href} className={active(item.href)} aria-current={active(item.href) ? 'page' : undefined}>{item.label}</Link>)}</nav><div className="header-actions"><Button variant="ghost" size="icon" aria-label="Search pages" onClick={() => setSearch(!search)}><Search /></Button><Button asChild className="join-button"><Link href="/contact">Join IFF <ArrowRight /></Link></Button><Button className="mobile-menu" variant="ghost" size="icon" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div></div>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<ArrowRight size={15} /></Link>)}<Link href="/speaking" onClick={() => setOpen(false)}>Speaking Opportunities <ArrowRight size={15} /></Link></nav>}{search && <div className="search-panel"><label htmlFor="site-search">Search IFF</label><input id="site-search" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a page…" />{navigation.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).map(item => <Link key={item.href} href={item.href} onClick={() => setSearch(false)}>{item.label}<ArrowRight size={16} /></Link>)}</div>}</header>
}

export function Footer({ logo }: { logo: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: 'idle' })
  const pathname = usePathname()
  const active = (href: string) => (pathname === href ? 'active' : undefined)
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo inverse src={logo} /><p>A premier leadership institution connecting C-suite leaders, regulators, and innovators across India’s banking, insurance, asset management, and fintech ecosystems.</p><span className="footer-motto">LEADERSHIP · INNOVATION · POLICY</span></div><div><h3>ABOUT IFF</h3><Link href="/about" className={active('/about')}>Mission & Vision</Link><Link href="/about">Leadership Council</Link><Link href="/about">Governance Charter</Link><Link href="/professionals" className={active('/professionals')}>For Professionals</Link></div><div><h3>EXPLORE & OPPORTUNITIES</h3><Link href="/organisations" className={active('/organisations')}>For Organisations</Link><Link href="/events" className={active('/events')}>Flagship Summits & Roundtables</Link><Link href="/speaking" className={active('/speaking')}>Speaking Opportunities</Link><Link href="/job-seekers" className={active('/job-seekers')}>Executive Career Portal</Link><Link href="/knowledge-hub" className={active('/knowledge-hub')}>Research & Insights</Link></div><div><h3>EXECUTIVE DISPATCH</h3><p>Receive policy briefings and closed-door leadership invitations directly.</p><form className="newsletter" action={action}><input type="email" name="email" required aria-label="Newsletter email" placeholder="Enter business email" /><input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: 'absolute', left: -10000, width: 1, height: 1 }} /><Button type="submit" size="sm" disabled={pending}>Subscribe <ArrowRight /></Button></form>{state.status !== 'idle' && <p role="status">{state.message}</p>}</div></div><div className="container footer-bottom"><span>© 2026 Indian Financial Forum. All rights reserved.</span><span>Leadership · Innovation · Institutional Excellence</span></div></footer>
}
