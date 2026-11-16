/**
 * Loads the starting content from the original site so the CMS isn't empty.
 * Safe to re-run: existing records (matched by slug / name) are left alone.
 *
 *   npm run seed
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=... npm run seed   # also creates the first admin
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

const events = [
  { title: 'IFF Annual Leadership Summit 2026: Navigating the Next Wave of Indian Banking', category: 'summit', featured: true, city: 'Mumbai', format: 'In-person', summary: 'C-suite visionaries, regulators and infrastructure architects come together for a two-day symposium on economic resilience and generative AI.' },
  { title: 'IFF Risk & Compliance Roundtable', category: 'roundtable', city: 'Mumbai', format: 'In-person', summary: 'Managing systemic liquidity pressures, cyber exposure and evolving regulation.' },
  { title: 'Digital Lending & FLDG Masterclass', category: 'webinar', format: 'Virtual', summary: 'Decoding digital lending guidelines, first-loss default guarantees and responsible innovation.' },
  { title: 'Women in BFSI Leadership Assembly', category: 'networking', format: 'In-person', summary: 'Connecting leaders and celebrating the perspectives shaping finance.' },
  { title: 'Treasury & Liquidity Management', category: 'roundtable', format: 'Hybrid', summary: 'Fresh perspectives on liquidity strategy and financial resilience.' },
] as const

for (const e of events) {
  const existing = await payload.find({ collection: 'events', where: { title: { equals: e.title } }, limit: 1 })
  if (!existing.docs.length) await payload.create({ collection: 'events', data: { ...e } })
}

const leaders = ['Abhishek Varshney', 'Arnab', 'Sachin Agarwal']
for (const [i, name] of leaders.entries()) {
  const existing = await payload.find({ collection: 'leaders', where: { name: { equals: name } }, limit: 1 })
  if (!existing.docs.length) await payload.create({ collection: 'leaders', data: { name, group: 'community', designation: 'Founding leadership', order: i } })
}

// Insights listed on the original site. They only had a summary, so they start as drafts for the team to write and publish.
const drafts = [
  { title: 'The next phase of digital lending in India', type: 'blog', excerpt: 'How institutional collaboration, responsible innovation and evolving regulation are shaping the future of credit.', duration: '6 min read' },
  { title: 'Building future-ready BFSI talent', type: 'blog', excerpt: 'The skills, leadership and connections that will shape the next generation of financial professionals.', duration: '5 min read' },
  { title: 'What’s next for India’s financial sector?', type: 'blog', excerpt: 'Opportunities and priorities for banking, insurance, asset management and fintech.' },
] as const
for (const d of drafts) {
  const existing = await payload.find({ collection: 'posts', where: { title: { equals: d.title } }, limit: 1, draft: true })
  if (!existing.docs.length) await payload.create({ collection: 'posts', data: { ...d, _status: 'draft' }, draft: true })
}

const settings = await payload.findGlobal({ slug: 'site-settings' })
if (!settings.partners?.length) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      partners: ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak', 'Bajaj Finserv', 'Adani'].map((name) => ({ name })),
    },
  })
}

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'uniquegrimreaper@gmail.com'
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'omega#12345'

const existingAdmin = await payload.find({ collection: 'users', where: { email: { equals: adminEmail } }, limit: 1 })
if (!existingAdmin.docs.length) {
  await payload.create({ collection: 'users', data: { email: adminEmail, password: adminPassword, name: 'Administrator', role: 'admin' } })
  payload.logger.info(`Created admin account: ${adminEmail}`)
} else {
  await payload.update({ collection: 'users', id: existingAdmin.docs[0].id, data: { role: 'admin', password: adminPassword } })
  payload.logger.info(`Updated admin account credentials: ${adminEmail}`)
}

payload.logger.info('Seed complete.')
process.exit(0)
