export const navigation = [
  { label: 'About Us', to: '/about' },
  { label: 'For Professionals', to: '/professionals' },
  { label: 'For Organisations', to: '/organisations' },
  { label: 'Events', to: '/events' },
  { label: 'Knowledge Hub', to: '/knowledge-hub' },
  { label: 'Job Seekers', to: '/job-seekers' },
  { label: 'Contact Us', to: '/contact' },
] as const;

export function pageHead(title: string, description: string) {
  const fullTitle = `${title} | Indian Financial Forum`;
  return { meta: [
    { title: fullTitle }, { name: 'description', content: description },
    { property: 'og:title', content: fullTitle }, { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] };
}