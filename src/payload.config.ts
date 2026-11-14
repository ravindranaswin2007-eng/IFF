import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Resumes } from './collections/Resumes'
import { Posts } from './collections/Posts'
import { Events } from './collections/Events'
import { Leaders, Volunteers } from './collections/People'
import { Submissions, Subscribers } from './collections/Submissions'
import { SiteImages, SiteSettings } from './globals/SiteImages'
import { revalidateSite } from './hooks/revalidate'
import { migrations } from './migrations'
import { normaliseConnectionString } from './lib/db-url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const useS3 = Boolean(process.env.S3_BUCKET)

/**
 * Connection string from DATABASE_URI, the variables Vercel's Neon/Supabase integrations add
 * (POSTGRES_URL / DATABASE_URL), or the DB_* parts that ECS injects from the RDS secret on AWS.
 */
function databaseUri() {
  const direct = process.env.DATABASE_URI || process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (direct) return normaliseConnectionString(direct)
  const { DB_HOST, DB_PORT = '5432', DB_NAME = 'iff', DB_USER, DB_PASSWORD } = process.env
  if (!DB_HOST || !DB_USER) return ''
  return `postgres://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD ?? '')}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

const withRevalidate = <T extends { hooks?: Record<string, unknown> }>(config: T): T => ({
  ...config,
  hooks: { ...config.hooks, afterChange: [revalidateSite], afterDelete: [revalidateSite] },
})

export default buildConfig({
  serverURL: process.env.SERVER_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ''),
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · IFF Admin' },
    avatar: 'default',
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    withRevalidate(Posts), withRevalidate(Events), withRevalidate(Leaders), withRevalidate(Volunteers),
    Submissions, Subscribers, Media, Documents, Resumes, Users,
  ],
  globals: [withRevalidate(SiteImages), withRevalidate(SiteSettings)],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: databaseUri(), ssl: process.env.DATABASE_SSL === 'true' || /sslmode=require/.test(databaseUri()) ? { rejectUnauthorized: false } : undefined,
      max: process.env.VERCEL ? 3 : 10 },
    // Production applies the committed migrations on boot; development pushes schema changes directly.
    // Own schema keeps IFF tables out of any auto-exposed "public" API (e.g. Supabase's Data API).
    schemaName: process.env.DATABASE_SCHEMA || 'iff',
    prodMigrations: migrations,
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: [
    // "Export" button (CSV / JSON) on enquiries, subscribers and volunteers; "Import" for bulk volunteer uploads.
    importExportPlugin({
      collections: [
        { slug: 'submissions', import: false, export: { disableJobsQueue: true } },
        { slug: 'subscribers', import: false, export: { disableJobsQueue: true } },
        { slug: 'volunteers', export: { disableJobsQueue: true }, import: { disableJobsQueue: true } },
      ],
      overrideExportCollection: ({ collection }) => ({ ...collection, admin: { ...collection.admin, group: 'Enquiries' }, access: { ...collection.access, read: ({ req }) => Boolean(req.user) } }),
      overrideImportCollection: ({ collection }) => ({ ...collection, admin: { ...collection.admin, group: 'People' } }),
    }),
    // Vercel hosting: uploads go to Vercel Blob (files are served through Payload, so résumés stay staff-only).
    ...(!useS3 && process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true, documents: true, resumes: true, exports: true, imports: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: true,
          }),
        ]
      : []),
    ...(useS3
    ? [
        s3Storage({
          collections: { media: { prefix: 'media' }, documents: { prefix: 'documents' }, resumes: { prefix: 'resumes' }, exports: { prefix: 'exports' }, imports: { prefix: 'imports' } },
          bucket: process.env.S3_BUCKET as string,
          config: {
            region: process.env.S3_REGION,
            ...(process.env.S3_ACCESS_KEY_ID
              ? { credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string } }
              : {}),
          },
        }),
      ]
    : []),
  ],
})
