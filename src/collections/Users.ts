import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isLoggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 60 * 60 * 8, maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  admin: { useAsTitle: 'email', group: 'Settings', defaultColumns: ['name', 'email', 'role'] },
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin – manages everything, including users', value: 'admin' },
        { label: 'Editor – publishes content and handles enquiries', value: 'editor' },
      ],
      access: { update: isAdminField },
      saveToJWT: true,
    },
  ],
}
