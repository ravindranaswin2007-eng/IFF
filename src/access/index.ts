import type { Access, FieldAccess } from 'payload'

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'
export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'
export const anyone: Access = () => true
/** Public visitors see published documents only; signed-in staff see drafts too. */
export const publishedOrLoggedIn: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })
