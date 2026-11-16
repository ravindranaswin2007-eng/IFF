/**
 * Tolerates connection strings pasted straight from a dashboard: surrounding quotes/whitespace,
 * a password left in [brackets], and unescaped special characters (@ # / ? %) in the password.
 */
export function normaliseConnectionString(raw: string) {
  const value = raw.trim().replace(/^['"]|['"]$/g, '')
  const match = value.match(/^(postgres(?:ql)?:\/\/)([^:/?#]+):(.*)@([^@]+)$/)
  if (!match) return value
  const [, scheme, user, rawPassword, rest] = match
  let password = rawPassword!.replace(/^\[(.*)\]$/, '$1')
  try { password = decodeURIComponent(password) } catch { /* contains a literal % – encode as-is */ }
  let host = rest!
  // On Vercel, Supabase's session pooler (port 5432) caps clients at the pool size and serverless
  // instances exhaust it; the transaction pooler on 6543 (same host and credentials) is built for this.
  if (process.env.VERCEL && /\.pooler\.supabase\.com:5432(?:\/|$)/.test(host)) host = host.replace(':5432', ':6543')
  return `${scheme}${user}:${encodeURIComponent(password)}@${host}`
}
