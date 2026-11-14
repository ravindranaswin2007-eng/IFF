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
export const siteUrl = process.env.SERVER_URL || 'http://localhost:3000'
