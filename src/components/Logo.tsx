import Link from 'next/link'
import type { Media } from '@/payload-types'

/** Uses the logo uploaded in Site settings; until then shows a typographic wordmark. */
export function Logo({ logo, inverse = false }: { logo?: Media | null; inverse?: boolean }) {
  return (
    <Link href="/" className={`brand${inverse && logo ? ' logo-inverse' : ''}`} aria-label="Indian Financial Forum — home">
      {logo?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.url} alt="Indian Financial Forum" width={logo.width ?? 160} height={logo.height ?? 46} />
      ) : (
        <>
          <span className="brand-mark" aria-hidden>IFF</span>
          <span className="brand-text"><strong>Indian Financial Forum</strong><small>Leadership · Innovation · Policy</small></span>
        </>
      )}
    </Link>
  )
}
