'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation } from '@/lib/site'

export function Header({ logo, logoInverse }: { logo: ReactNode; logoInverse: ReactNode }) {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 480 && y > prev && !open)
  })

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}${hidden ? ' hidden' : ''}`}>
        <div className="header-inner">
          {scrolled ? logo : logoInverse}
          <nav className="desktop-nav" aria-label="Main">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/contact?interest=membership" className={`btn btn-sm join-cta ${scrolled ? '' : 'btn-gold'}`}>Join IFF <ArrowRight /></Link>
            <button type="button" className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mobile-menu-top">
              {logoInverse}
              <button type="button" className="menu-toggle" style={{ display: 'grid' }} aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
            </div>
            <nav aria-label="Mobile">
              {[{ label: 'Home', href: '/' }, ...navigation, { label: 'Speaking Opportunities', href: '/speaking' }].map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6 }}>
                  <Link href={item.href} aria-current={(item.href === '/' ? pathname === '/' : isActive(item.href)) ? 'page' : undefined}>{item.label}<ArrowUpRight size={22} /></Link>
                </motion.div>
              ))}
            </nav>
            <Link href="/contact?interest=membership" className="btn btn-gold">Become a Member <ArrowRight /></Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
