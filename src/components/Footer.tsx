import Link from 'next/link'
import { Linkedin, Mail, MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SiteSetting } from '@/payload-types'
import { Newsletter } from './Newsletter'

export function Footer({ logo, settings }: { logo: ReactNode; settings: SiteSetting }) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-about">
            {logo}
            <p>A leadership community connecting C-suite leaders, regulators and innovators across India’s banking, insurance, asset management and fintech ecosystems.</p>
            <span className="footer-motto">Leadership · Innovation · Policy</span>
            <div className="footer-socials">
              {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="IFF on LinkedIn"><Linkedin /></a>}
              {settings.whatsapp && <a href={settings.whatsapp} target="_blank" rel="noreferrer" aria-label="IFF WhatsApp community"><MessageCircle /></a>}
              {settings.email && <a href={`mailto:${settings.email}`} aria-label="Email IFF"><Mail /></a>}
              {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, '')}`} aria-label="Call IFF"><Phone /></a>}
            </div>
          </div>
          <div>
            <h4>About IFF</h4>
            <ul>
              <li><Link href="/about">Mission & Vision</Link></li>
              <li><Link href="/about#leadership">Leadership Council</Link></li>
              <li><Link href="/about#volunteers">Volunteers</Link></li>
              <li><Link href="/professionals">For Professionals</Link></li>
              <li><Link href="/organisations">For Organisations</Link></li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/events">Summits & Roundtables</Link></li>
              <li><Link href="/knowledge-hub">Knowledge Hub</Link></li>
              <li><Link href="/speaking">Speaking Opportunities</Link></li>
              <li><Link href="/job-seekers">Career Portal</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Executive Dispatch</h4>
            <p style={{ fontSize: '.95rem' }}>Policy briefings, research and invitations to closed-door leadership sessions — straight to your inbox.</p>
            <Newsletter />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Indian Financial Forum. All rights reserved.</span>
          <span>Leadership · Innovation · Institutional Excellence</span>
        </div>
        <div className="footer-wordmark" aria-hidden>Indian Financial Forum</div>
      </div>
    </footer>
  )
}
