import { ButtonLink } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="not-found">
      <div>
        <span className="eyebrow">404</span>
        <h1 className="h1" style={{ margin: '18px 0' }}>This page has moved on.</h1>
        <p className="lead" style={{ marginBottom: 32 }}>The link may be outdated. Let’s get you back to the conversation.</p>
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </section>
  )
}
