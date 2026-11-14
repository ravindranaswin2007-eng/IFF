// Load-balancer health check. Kept free of database calls so a slow DB doesn't cycle healthy containers.
export const dynamic = 'force-dynamic'
export function GET() {
  return new Response('ok', { headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' } })
}
