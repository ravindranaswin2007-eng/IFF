# Indian Financial Forum — website & CMS

The public website for the Indian Financial Forum plus an admin panel where the team publishes content and handles enquiries. Built to run on AWS.

| | |
|---|---|
| **Website** | Next.js 16 (React 19), server-rendered, with Motion animations |
| **CMS / admin** | Payload CMS 3, at `/admin` on the same site |
| **Database** | PostgreSQL (Amazon RDS in production) |
| **File storage** | Amazon S3 (photos, reports, podcasts, résumés) |
| **Hosting** | AWS: CloudFront → load balancer → ECS Fargate container, defined in `infra/` (AWS CDK) |

## What the team can do in `/admin`

| Area | What it's for |
|---|---|
| **Content → Knowledge Hub** | Blogs, reports (PDF), podcasts (audio file or Spotify link) and webinars (YouTube/Vimeo link). Save as a draft, preview, then **Publish**. Tick *Featured* to show an item on the home page. |
| **Content → Events** | Summits, roundtables, webinars and networking events. Without a registration link, the “Express interest” button opens the contact form tagged with that event. |
| **People → Leadership / Volunteers** | Leadership council and the “Active Volunteers” grid on About Us. |
| **Enquiries** | Every form on the site lands here: contact, membership requests, partnership enquiries, speaker applications, job-seeker profiles (with résumé) and event interest. Filter by type or status, add internal notes, and **⋮ → Export** to CSV. Newsletter sign-ups are under *Newsletter subscribers*. |
| **Settings → Page photographs** | The hero photo (top) and closing-banner photo (above the footer) for every page, plus the event gallery and feature photos. |
| **Settings → Site settings** | Logo, contact email/phone, offices, social links, partner logos, partnership brochure. |
| **Settings → Users** | Admins (everything) and editors (content + enquiries). |

Until a photo is uploaded, its slot shows a branded navy graphic — the site never shows stock or AI-generated images.

### Importing volunteer profiles from the Google Form

1. Open the form → **Responses** → the Sheets icon → **File → Download → CSV**.
2. Run against the target database:
   ```bash
   npm run import:volunteers -- ~/Downloads/responses.csv
   ```
   Columns are matched by their wording (name, designation/role, organisation/company, city, LinkedIn, photo). Photos uploaded through the form are downloaded if the Drive files are shared as “Anyone with the link”; otherwise the original link is kept on the volunteer record so the photo can be added by hand. Re-running updates existing people rather than duplicating them.

Alternatively use **People → Volunteers → ⋮ → Import** in the admin to upload a CSV directly.

## Local development

Requires Node 20.9+ and PostgreSQL 14+.

```bash
cp .env.example .env          # then set DATABASE_URI and PAYLOAD_SECRET
npm install
npm run dev                   # http://localhost:3000, admin at /admin
```

In development the database schema is synced automatically. To load the starting content (events, leadership, partner names, draft blog posts from the original site):

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='choose-a-password' npm run seed
```

### Changing the data model

After editing anything in `src/collections` or `src/globals`:

```bash
npm run generate:types
npm run migrate:create -- describe-the-change   # writes a migration into src/migrations — commit it
```

Production applies pending migrations automatically when the container starts.

## Deploying to AWS

Everything is defined in `infra/` with the AWS CDK. One command creates and updates the whole stack:

```
Visitors ─HTTPS─▶ CloudFront ─▶ Application Load Balancer ─▶ ECS Fargate (this app)
                                                            ├─▶ RDS PostgreSQL 16 (private subnet, encrypted, 7-day backups)
                                                            └─▶ S3 bucket (private, encrypted, versioned)
Secrets (database password, session key) live in AWS Secrets Manager.
```

Prerequisites: an AWS account, the AWS CLI signed in (`aws configure` or SSO), Docker running locally, Node 20+.

```bash
cd infra
npm install
npx cdk bootstrap            # once per account/region
npx cdk deploy               # builds the Docker image, pushes it to ECR and deploys (~20 min the first time)
```

The deploy prints `SiteUrl` and `AdminUrl`. Open `AdminUrl` and create the first admin account. Then, optionally, load the starter content by running the seed against RDS (see below).

The default region is **ap-south-1 (Mumbai)**; change `region` in `infra/cdk.json` if needed.

### Custom domain

1. In **AWS Certificate Manager, region us-east-1** (CloudFront requires this region), request a certificate for e.g. `www.indianfinancialforum.org` and validate it via DNS.
2. Deploy with the domain:
   ```bash
   npx cdk deploy -c domainName=www.indianfinancialforum.org -c certificateArn=arn:aws:acm:us-east-1:…
   ```
3. At your DNS provider, add a CNAME from `www` to the `CloudFrontDomain` output.

### Other settings (`infra/cdk.json` or `-c key=value`)

| Key | Default | |
|---|---|---|
| `desiredCount` | `1` | Minimum running containers (auto-scales up to 4 on CPU). Use `2` for zero-downtime resilience. |
| `dbInstanceClass` | `t4g.micro` | RDS size. `t4g.small` for more traffic. |
| `multiAz` | `false` | Standby database in a second zone (doubles DB cost). |

### Running the seed or volunteer import against production

The database sits in a private subnet. The simplest route is a one-off ECS task using the same image (ECS console → *Run task* with the service's task definition, overriding the command to `npx payload run src/scripts/seed.ts`) — or temporarily connect from your machine through an SSM bastion. Day-to-day, everything is done through `/admin` instead.

### Rough running cost

At low traffic, about **US$60–80/month** in ap-south-1: Fargate (0.5 vCPU / 1 GB) ~$18, load balancer ~$20, RDS t4g.micro + storage ~$16, public IPv4 addresses ~$11, plus small amounts for CloudFront, S3, Secrets Manager and logs. This is an estimate; check the AWS Pricing Calculator for your usage.

### Operations

- **Logs:** CloudWatch log group in the `LogGroupName` output.
- **Backups:** RDS automated backups (7 days); S3 keeps previous versions of files for 90 days.
- **Rollback:** ECS automatically rolls back a deployment whose containers fail health checks (`/healthz`).
- **Deleting the stack** keeps the S3 bucket and takes a final database snapshot. The database has deletion protection on.

## Project layout

```
src/
  app/(frontend)/      website pages, layout, server actions for forms
  app/(payload)/       admin panel + REST API (generated boilerplate)
  collections/         CMS data model: posts, events, people, enquiries, uploads, users
  globals/             page photographs + site settings
  components/          header, footer, hero, cards, forms, animation helpers
  migrations/          database migrations (applied on boot in production)
  scripts/             seed + volunteer CSV import
infra/                 AWS CDK stack
Dockerfile             production image (Next.js standalone)
```
