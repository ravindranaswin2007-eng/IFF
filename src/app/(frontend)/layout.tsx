import type { Metadata, Viewport } from 'next'
import { Manrope, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { MotionProvider, ScrollProgress } from '@/components/motion'
import { asMedia, getSettings } from '@/lib/payload'
import { siteName, siteUrl } from '@/lib/site'
import './globals.css'

// Content comes from the CMS, so pages render on request (and are refreshed when editors publish).
export const dynamic = 'force-dynamic'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', style: ['normal', 'italic'], weight: ['400', '500', '600'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} — The community behind BFSI leadership`, template: `%s · ${siteName}` },
  description: 'India’s community for financial leadership, institutional dialogue and BFSI collaboration.',
  openGraph: { type: 'website', siteName, locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/favicon.svg' },
}
export const viewport: Viewport = { themeColor: '#0a1b3b' }

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  const logo = asMedia(settings.logo)
  const inverse = asMedia(settings.logoInverse)
  return (
    <html lang="en-IN" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <MotionProvider>
          <ScrollProgress />
          <Header logo={<Logo logo={logo} />} logoInverse={inverse ? <Logo logo={inverse} /> : <Logo logo={logo} inverse />} />
          <main id="main">{children}</main>
          <Footer settings={settings} logo={inverse ? <Logo logo={inverse} /> : <Logo logo={logo} inverse />} />
        </MotionProvider>
      </body>
    </html>
  )
}
