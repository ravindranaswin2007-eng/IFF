import { revalidatePath } from 'next/cache'

/** Refresh rendered pages when editors change content. Safe to call outside a Next request (seed scripts). */
export const revalidateSite = ({ doc }: { doc?: unknown }) => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js (e.g. CLI scripts) – nothing to revalidate.
  }
  return doc
}
