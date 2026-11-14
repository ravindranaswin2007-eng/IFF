import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Header } from '@/components/site-shell'
import { getSettings, mediaUrl } from '@/lib/payload'
import { siteUrl } from '@/lib/site'
import './globals.css'

// Content comes from the CMS, so pages render on request (and are refreshed when editors publish).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Indian Financial Forum', template: '%s | Indian Financial Forum' },
  description: 'India’s community for financial leadership, institutional dialogue and BFSI collaboration.',
  authors: [{ name: 'Indian Financial Forum' }],
  openGraph: { title: 'Indian Financial Forum', description: 'Connecting India’s financial leadership.', type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  const logo = mediaUrl(settings.logo) ?? ''
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap" />
      </head>
      <body>
        <Header logo={logo} />
        <main>{children}</main>
        <Footer logo={logo} />
      </body>
    </html>
  )
}
