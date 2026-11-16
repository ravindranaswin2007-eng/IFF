/**
 * Standalone script to create or update the admin account.
 *
 * Usage:
 *   npm run set:admin
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const email = process.env.ADMIN_EMAIL || 'uniquegrimreaper@gmail.com'
const password = process.env.ADMIN_PASSWORD || 'omega#12345'

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})

if (!existing.docs.length) {
  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name: 'Administrator',
      role: 'admin',
    },
    overrideAccess: true,
  })
  payload.logger.info(`Successfully created admin user: ${email}`)
} else {
  await payload.update({
    collection: 'users',
    id: existing.docs[0].id,
    data: {
      role: 'admin',
      password,
    },
    overrideAccess: true,
  })
  payload.logger.info(`Successfully updated admin user credentials for: ${email}`)
}

process.exit(0)
