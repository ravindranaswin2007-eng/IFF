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
  return `${scheme}${user}:${encodeURIComponent(password)}@${rest}`
}
