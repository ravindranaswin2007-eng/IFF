import type { Access, FieldAccess } from 'payload'

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)
/** Full admin access granted to all logged-in staff (no permission blocks) */
export const isAdmin: Access = ({ req }) => Boolean(req.user)
export const isAdminField: FieldAccess = ({ req }) => Boolean(req.user)
export const anyone: Access = () => true
/** Public visitors see published documents only; signed-in staff see drafts too. */
export const publishedOrLoggedIn: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })
