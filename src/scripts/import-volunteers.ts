/**
 * Imports volunteer profiles from the Google Form responses.
 *
 * 1. Open the form → Responses → the green Sheets icon → File → Download → CSV.
 * 2. npm run import:volunteers -- path/to/responses.csv
 *
 * Columns are matched by header text, so the exact question wording doesn't matter
 * (e.g. "Full Name", "Designation / Role", "Company", "City", "LinkedIn", "Photo").
 * Photo links uploaded through the form are downloaded when they are shared as
 * "Anyone with the link"; otherwise the link is kept so the photo can be added by hand.
 * Re-running updates existing volunteers (matched by name) instead of duplicating them.
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const file = process.argv.slice(2).find((a) => a.endsWith('.csv'))
if (!file) { console.error('Usage: npm run import:volunteers -- responses.csv'); process.exit(1) }

/** Minimal RFC-4180 CSV parser (handles quotes, commas and newlines inside fields). */
function parseCsv(input: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false
  for (let i = 0; i < input.length; i++) {
    const c = input[i]!
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') { field += '"'; i++ } else if (c === '"') quoted = false; else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && input[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((v) => v.trim()))
}

const [header, ...records] = parseCsv(fs.readFileSync(path.resolve(file), 'utf8').replace(/^﻿/, ''))
if (!header) { console.error('The CSV file is empty.'); process.exit(1) }
const find = (...words: string[]) => header.findIndex((h) => words.some((w) => h.toLowerCase().includes(w)))
const col = {
  name: find('full name', 'name'),
  designation: find('designation', 'role', 'title', 'position'),
  organisation: find('organisation', 'organization', 'company', 'employer', 'institution'),
  city: find('city', 'location', 'chapter'),
  linkedin: find('linkedin'),
  photo: find('photo', 'picture', 'image', 'headshot'),
  email: find('email'),
}
if (col.name < 0) { console.error(`Couldn't find a "Name" column. Headers found: ${header.join(' | ')}`); process.exit(1) }
console.log('Column mapping:', Object.fromEntries(Object.entries(col).map(([k, i]) => [k, i >= 0 ? header[i] : '—'])))

const payload = await getPayload({ config })

async function downloadPhoto(url: string, name: string) {
  const id = url.match(/[?&]id=([\w-]+)/)?.[1] ?? url.match(/\/d\/([\w-]+)/)?.[1]
  if (!id) return null
  try {
    const res = await fetch(`https://drive.google.com/uc?export=download&id=${id}`, { redirect: 'follow' })
    const type = res.headers.get('content-type') ?? ''
    if (!res.ok || !type.startsWith('image/')) return null
    const data = Buffer.from(await res.arrayBuffer())
    const media = await payload.create({ collection: 'media', data: { alt: `Portrait of ${name}` }, file: { data, mimetype: type, name: `${name.replace(/\W+/g, '-').toLowerCase()}.${type.split('/')[1]}`, size: data.length } })
    return media.id
  } catch { return null }
}

let created = 0, updated = 0, photos = 0
for (const [i, r] of records.entries()) {
  const get = (k: keyof typeof col) => (col[k] >= 0 ? (r[col[k]] ?? '').trim() : '')
  const name = get('name')
  if (!name) continue
  let linkedin = get('linkedin')
  if (linkedin && !/^https?:\/\//.test(linkedin)) linkedin = `https://${linkedin}`
  const photoUrl = get('photo').split(',')[0]?.trim() ?? ''
  const existing = await payload.find({ collection: 'volunteers', where: { name: { equals: name } }, limit: 1, depth: 0 })
  const data: Record<string, unknown> = { name, designation: get('designation'), organisation: get('organisation'), city: get('city'), linkedin, photoSourceUrl: photoUrl || undefined, order: i, active: true }
  if (photoUrl && !existing.docs[0]?.photo) {
    const id = await downloadPhoto(photoUrl, name)
    if (id) { data.photo = id; photos++ }
  }
  if (existing.docs[0]) { await payload.update({ collection: 'volunteers', id: existing.docs[0].id, data }); updated++ }
  else { await payload.create({ collection: 'volunteers', data: data as never }); created++ }
}
console.log(`Volunteers imported: ${created} new, ${updated} updated, ${photos} photos downloaded.`)
process.exit(0)
