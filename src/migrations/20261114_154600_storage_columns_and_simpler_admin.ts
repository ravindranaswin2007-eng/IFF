import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "iff"."site_settings_offices" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "iff"."site_settings_offices" CASCADE;
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_home_hero_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_home_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_about_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_events_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_knowledge_hub_hero_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_knowledge_hub_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_job_seekers_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_speaking_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_contact_hero_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_contact_banner_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_summit_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_careers_feature_id_media_id_fk";
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_about_story_id_media_id_fk";
  
  ALTER TABLE "iff"."site_settings_partners" DROP CONSTRAINT "site_settings_partners_logo_id_media_id_fk";
  
  ALTER TABLE "iff"."site_settings" DROP CONSTRAINT "site_settings_logo_inverse_id_media_id_fk";
  
  DROP INDEX "iff"."site_images_home_home_hero_idx";
  DROP INDEX "iff"."site_images_home_home_banner_idx";
  DROP INDEX "iff"."site_images_about_about_banner_idx";
  DROP INDEX "iff"."site_images_events_events_banner_idx";
  DROP INDEX "iff"."site_images_knowledge_hub_knowledge_hub_hero_idx";
  DROP INDEX "iff"."site_images_knowledge_hub_knowledge_hub_banner_idx";
  DROP INDEX "iff"."site_images_job_seekers_job_seekers_banner_idx";
  DROP INDEX "iff"."site_images_speaking_speaking_banner_idx";
  DROP INDEX "iff"."site_images_contact_contact_hero_idx";
  DROP INDEX "iff"."site_images_contact_contact_banner_idx";
  DROP INDEX "iff"."site_images_summit_idx";
  DROP INDEX "iff"."site_images_organisations_feature_idx";
  DROP INDEX "iff"."site_images_careers_feature_idx";
  DROP INDEX "iff"."site_images_about_story_idx";
  DROP INDEX "iff"."site_settings_partners_logo_idx";
  DROP INDEX "iff"."site_settings_logo_inverse_idx";
  ALTER TABLE "iff"."media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "iff"."media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "iff"."media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "iff"."documents" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "iff"."documents" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "iff"."resumes" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "iff"."resumes" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "iff"."exports" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "iff"."exports" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "iff"."imports" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "iff"."imports" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "iff"."site_images" ADD COLUMN "events_summit_id" integer;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_events_summit_id_media_id_fk" FOREIGN KEY ("events_summit_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_images_organisations_organisations_feature_idx" ON "iff"."site_images" USING btree ("organisations_feature_id");
  CREATE INDEX "site_images_events_events_summit_idx" ON "iff"."site_images" USING btree ("events_summit_id");
  ALTER TABLE "iff"."media" DROP COLUMN "credit";
  ALTER TABLE "iff"."site_images" DROP COLUMN "home_hero_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "home_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "about_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "events_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "knowledge_hub_hero_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "knowledge_hub_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "job_seekers_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "speaking_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "contact_hero_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "contact_banner_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "summit_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "careers_feature_id";
  ALTER TABLE "iff"."site_images" DROP COLUMN "about_story_id";
  ALTER TABLE "iff"."site_settings_partners" DROP COLUMN "logo_id";
  ALTER TABLE "iff"."site_settings" DROP COLUMN "logo_inverse_id";
  ALTER TABLE "iff"."site_settings" DROP COLUMN "email";
  ALTER TABLE "iff"."site_settings" DROP COLUMN "phone";
  ALTER TABLE "iff"."site_settings" DROP COLUMN "linkedin";
  ALTER TABLE "iff"."site_settings" DROP COLUMN "whatsapp";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "iff"."site_settings_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"address" varchar
  );
  
  ALTER TABLE "iff"."site_images" DROP CONSTRAINT "site_images_events_summit_id_media_id_fk";
  
  DROP INDEX "iff"."site_images_organisations_organisations_feature_idx";
  DROP INDEX "iff"."site_images_events_events_summit_idx";
  ALTER TABLE "iff"."media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "iff"."media" ADD COLUMN "credit" varchar;
  ALTER TABLE "iff"."site_images" ADD COLUMN "home_hero_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "home_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "about_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "events_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "knowledge_hub_hero_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "knowledge_hub_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "job_seekers_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "speaking_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "contact_hero_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "contact_banner_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "summit_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "careers_feature_id" integer;
  ALTER TABLE "iff"."site_images" ADD COLUMN "about_story_id" integer;
  ALTER TABLE "iff"."site_settings_partners" ADD COLUMN "logo_id" integer;
  ALTER TABLE "iff"."site_settings" ADD COLUMN "logo_inverse_id" integer;
  ALTER TABLE "iff"."site_settings" ADD COLUMN "email" varchar;
  ALTER TABLE "iff"."site_settings" ADD COLUMN "phone" varchar;
  ALTER TABLE "iff"."site_settings" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "iff"."site_settings" ADD COLUMN "whatsapp" varchar;
  ALTER TABLE "iff"."site_settings_offices" ADD CONSTRAINT "site_settings_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "iff"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_offices_order_idx" ON "iff"."site_settings_offices" USING btree ("_order");
  CREATE INDEX "site_settings_offices_parent_id_idx" ON "iff"."site_settings_offices" USING btree ("_parent_id");
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_home_hero_id_media_id_fk" FOREIGN KEY ("home_hero_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_home_banner_id_media_id_fk" FOREIGN KEY ("home_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_about_banner_id_media_id_fk" FOREIGN KEY ("about_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_events_banner_id_media_id_fk" FOREIGN KEY ("events_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_knowledge_hub_hero_id_media_id_fk" FOREIGN KEY ("knowledge_hub_hero_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_knowledge_hub_banner_id_media_id_fk" FOREIGN KEY ("knowledge_hub_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_job_seekers_banner_id_media_id_fk" FOREIGN KEY ("job_seekers_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_speaking_banner_id_media_id_fk" FOREIGN KEY ("speaking_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_contact_hero_id_media_id_fk" FOREIGN KEY ("contact_hero_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_contact_banner_id_media_id_fk" FOREIGN KEY ("contact_banner_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_summit_id_media_id_fk" FOREIGN KEY ("summit_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_careers_feature_id_media_id_fk" FOREIGN KEY ("careers_feature_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_images" ADD CONSTRAINT "site_images_about_story_id_media_id_fk" FOREIGN KEY ("about_story_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_settings_partners" ADD CONSTRAINT "site_settings_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "iff"."site_settings" ADD CONSTRAINT "site_settings_logo_inverse_id_media_id_fk" FOREIGN KEY ("logo_inverse_id") REFERENCES "iff"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_images_home_home_hero_idx" ON "iff"."site_images" USING btree ("home_hero_id");
  CREATE INDEX "site_images_home_home_banner_idx" ON "iff"."site_images" USING btree ("home_banner_id");
  CREATE INDEX "site_images_about_about_banner_idx" ON "iff"."site_images" USING btree ("about_banner_id");
  CREATE INDEX "site_images_events_events_banner_idx" ON "iff"."site_images" USING btree ("events_banner_id");
  CREATE INDEX "site_images_knowledge_hub_knowledge_hub_hero_idx" ON "iff"."site_images" USING btree ("knowledge_hub_hero_id");
  CREATE INDEX "site_images_knowledge_hub_knowledge_hub_banner_idx" ON "iff"."site_images" USING btree ("knowledge_hub_banner_id");
  CREATE INDEX "site_images_job_seekers_job_seekers_banner_idx" ON "iff"."site_images" USING btree ("job_seekers_banner_id");
  CREATE INDEX "site_images_speaking_speaking_banner_idx" ON "iff"."site_images" USING btree ("speaking_banner_id");
  CREATE INDEX "site_images_contact_contact_hero_idx" ON "iff"."site_images" USING btree ("contact_hero_id");
  CREATE INDEX "site_images_contact_contact_banner_idx" ON "iff"."site_images" USING btree ("contact_banner_id");
  CREATE INDEX "site_images_summit_idx" ON "iff"."site_images" USING btree ("summit_id");
  CREATE INDEX "site_images_organisations_feature_idx" ON "iff"."site_images" USING btree ("organisations_feature_id");
  CREATE INDEX "site_images_careers_feature_idx" ON "iff"."site_images" USING btree ("careers_feature_id");
  CREATE INDEX "site_images_about_story_idx" ON "iff"."site_images" USING btree ("about_story_id");
  CREATE INDEX "site_settings_partners_logo_idx" ON "iff"."site_settings_partners" USING btree ("logo_id");
  CREATE INDEX "site_settings_logo_inverse_idx" ON "iff"."site_settings" USING btree ("logo_inverse_id");
  ALTER TABLE "iff"."media" DROP COLUMN "prefix";
  ALTER TABLE "iff"."media" DROP COLUMN "_objectkey";
  ALTER TABLE "iff"."documents" DROP COLUMN "prefix";
  ALTER TABLE "iff"."documents" DROP COLUMN "_objectkey";
  ALTER TABLE "iff"."resumes" DROP COLUMN "prefix";
  ALTER TABLE "iff"."resumes" DROP COLUMN "_objectkey";
  ALTER TABLE "iff"."exports" DROP COLUMN "prefix";
  ALTER TABLE "iff"."exports" DROP COLUMN "_objectkey";
  ALTER TABLE "iff"."imports" DROP COLUMN "prefix";
  ALTER TABLE "iff"."imports" DROP COLUMN "_objectkey";
  ALTER TABLE "iff"."site_images" DROP COLUMN "events_summit_id";`)
}
