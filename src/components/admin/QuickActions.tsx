import Link from 'next/link'

/** Shown at the top of the admin dashboard: the everyday tasks, one click each. */
const actions = [
  { href: '/admin/globals/site-images', title: 'Change page photos', text: 'Swap the photos on About, Professionals, Organisations, Events, Job Seekers and Speaking.' },
  { href: '/admin/collections/submissions', title: 'View enquiries', text: 'Contact forms, membership requests, speaker applications and résumés.' },
  { href: '/admin/collections/events/create', title: 'Add an event', text: 'Appears on the Home and Events pages straight away.' },
  { href: '/admin/collections/posts/create', title: 'Publish a blog, report or podcast', text: 'Goes into the Knowledge Hub once you press Publish.' },
  { href: '/admin/collections/volunteers/create', title: 'Add a volunteer', text: 'Shown under Active Volunteers on About Us.' },
  { href: '/admin/globals/site-settings', title: 'Logo, partners & brochure', text: 'Header logo, “Trusted by” names and the partnership brochure.' },
]

export function QuickActions() {
  return (
    <div style={{ marginBottom: 'calc(var(--base) * 2)' }}>
      <h2 style={{ margin: '0 0 calc(var(--base) / 2)' }}>Welcome to the IFF website admin</h2>
      <p style={{ margin: '0 0 var(--base)', color: 'var(--theme-elevation-600)' }}>
        Pick a task below. Changes appear on the website as soon as you press Save (or Publish).{' '}
        <a href="/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Open the website ↗</a>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'calc(var(--base) / 2)' }}>
        {actions.map((a) => (
          <Link key={a.href} href={a.href} style={{ display: 'block', padding: 'var(--base)', border: '1px solid var(--theme-elevation-150)', borderRadius: 'var(--style-radius-m, 6px)', background: 'var(--theme-elevation-50)', textDecoration: 'none', color: 'inherit' }}>
            <strong style={{ display: 'block', marginBottom: 6 }}>{a.title} →</strong>
            <span style={{ color: 'var(--theme-elevation-600)', fontSize: 13, lineHeight: 1.45 }}>{a.text}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
