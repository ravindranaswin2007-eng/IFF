export const navigation = [
  { label: 'About Us', href: '/about' },
  { label: 'For Professionals', href: '/professionals' },
  { label: 'For Organisations', href: '/organisations' },
  { label: 'Events', href: '/events' },
  { label: 'Knowledge Hub', href: '/knowledge-hub' },
  { label: 'Job Seekers', href: '/job-seekers' },
  { label: 'Contact Us', href: '/contact' },
] as const

export const siteName = 'Indian Financial Forum'
/** Public URL: SERVER_URL if set, else Vercel's production domain, else localhost. */
export const siteUrl =
  process.env.SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
