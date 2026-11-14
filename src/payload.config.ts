import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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

const dirname = path.dirname(fileURLToPath(import.meta.url))
const useS3 = Boolean(process.env.S3_BUCKET)

/** DATABASE_URI, or one assembled from the DB_* variables that ECS injects from the RDS secret. */
function databaseUri() {
  if (process.env.DATABASE_URI) return process.env.DATABASE_URI
  const { DB_HOST, DB_PORT = '5432', DB_NAME = 'iff', DB_USER, DB_PASSWORD } = process.env
  if (!DB_HOST || !DB_USER) return ''
  return `postgres://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD ?? '')}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

const withRevalidate = <T extends { hooks?: Record<string, unknown> }>(config: T): T => ({
  ...config,
  hooks: { ...config.hooks, afterChange: [revalidateSite], afterDelete: [revalidateSite] },
})

export default buildConfig({
  serverURL: process.env.SERVER_URL || '',
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
    pool: { connectionString: databaseUri(), ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined },
    // Production applies the committed migrations on boot; development pushes schema changes directly.
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
