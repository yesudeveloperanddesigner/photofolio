import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_photos_orientation" AS ENUM('landscape', 'portrait', 'square');
  CREATE TYPE "public"."enum_settings_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'youtube', 'website', 'other');
  CREATE TYPE "public"."enum_settings_footer_date_time_display" AS ENUM('currentDate', 'currentTime', 'currentDateTime', 'custom', 'none');
  CREATE TABLE "photos_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"orientation" "enum_photos_orientation" DEFAULT 'landscape',
  	"location" varchar,
  	"shot_at" timestamp(3) with time zone,
  	"camera" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "galleries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"photos_id" integer
  );
  
  CREATE TABLE "settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_settings_socials_platform" DEFAULT 'instagram' NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Elena Marchetti' NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"logo_text" varchar,
  	"favicon_id" integer,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_location" varchar,
  	"contact_address" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"header_show_search" boolean DEFAULT true,
  	"header_cta_label" varchar,
  	"header_cta_url" varchar,
  	"header_cta_new_tab" boolean DEFAULT true,
  	"home_banner_image_id" integer,
  	"home_banner_eyebrow" varchar DEFAULT 'Photography · Since 2009',
  	"home_banner_title" varchar,
  	"home_banner_subtitle" varchar,
  	"home_banner_location" varchar,
  	"home_banner_overlay" numeric DEFAULT 45,
  	"footer_description" varchar,
  	"footer_copyright" varchar,
  	"footer_note" varchar,
  	"footer_date_time_show" boolean DEFAULT true,
  	"footer_date_time_label" varchar DEFAULT 'Local time',
  	"footer_date_time_display" "enum_settings_footer_date_time_display" DEFAULT 'currentDate',
  	"footer_date_time_custom_text" varchar,
  	"footer_date_time_timezone" varchar DEFAULT 'Europe/Lisbon',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "photos_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "photos_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "photos_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "photos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "photos_id" integer;
  ALTER TABLE "photos_tags" ADD CONSTRAINT "photos_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galleries_rels" ADD CONSTRAINT "galleries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galleries_rels" ADD CONSTRAINT "galleries_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_socials" ADD CONSTRAINT "settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_home_banner_image_id_media_id_fk" FOREIGN KEY ("home_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "photos_tags_order_idx" ON "photos_tags" USING btree ("_order");
  CREATE INDEX "photos_tags_parent_id_idx" ON "photos_tags" USING btree ("_parent_id");
  CREATE INDEX "photos_updated_at_idx" ON "photos" USING btree ("updated_at");
  CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");
  CREATE UNIQUE INDEX "photos_filename_idx" ON "photos" USING btree ("filename");
  CREATE INDEX "photos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "photos" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "photos_sizes_square_sizes_square_filename_idx" ON "photos" USING btree ("sizes_square_filename");
  CREATE INDEX "photos_sizes_small_sizes_small_filename_idx" ON "photos" USING btree ("sizes_small_filename");
  CREATE INDEX "photos_sizes_medium_sizes_medium_filename_idx" ON "photos" USING btree ("sizes_medium_filename");
  CREATE INDEX "photos_sizes_large_sizes_large_filename_idx" ON "photos" USING btree ("sizes_large_filename");
  CREATE INDEX "photos_sizes_xlarge_sizes_xlarge_filename_idx" ON "photos" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "photos_sizes_og_sizes_og_filename_idx" ON "photos" USING btree ("sizes_og_filename");
  CREATE INDEX "galleries_rels_order_idx" ON "galleries_rels" USING btree ("order");
  CREATE INDEX "galleries_rels_parent_idx" ON "galleries_rels" USING btree ("parent_id");
  CREATE INDEX "galleries_rels_path_idx" ON "galleries_rels" USING btree ("path");
  CREATE INDEX "galleries_rels_photos_id_idx" ON "galleries_rels" USING btree ("photos_id");
  CREATE INDEX "settings_socials_order_idx" ON "settings_socials" USING btree ("_order");
  CREATE INDEX "settings_socials_parent_id_idx" ON "settings_socials" USING btree ("_parent_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE INDEX "settings_logo_dark_idx" ON "settings" USING btree ("logo_dark_id");
  CREATE INDEX "settings_favicon_idx" ON "settings" USING btree ("favicon_id");
  CREATE INDEX "settings_seo_seo_og_image_idx" ON "settings" USING btree ("seo_og_image_id");
  CREATE INDEX "settings_home_banner_home_banner_image_idx" ON "settings" USING btree ("home_banner_image_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_photos_id_idx" ON "pages_rels" USING btree ("photos_id");
  CREATE INDEX "_pages_v_rels_photos_id_idx" ON "_pages_v_rels" USING btree ("photos_id");
  CREATE INDEX "posts_rels_photos_id_idx" ON "posts_rels" USING btree ("photos_id");
  CREATE INDEX "_posts_v_rels_photos_id_idx" ON "_posts_v_rels" USING btree ("photos_id");
  CREATE INDEX "payload_locked_documents_rels_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("photos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "photos_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "galleries_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "photos_tags" CASCADE;
  DROP TABLE "photos" CASCADE;
  DROP TABLE "galleries_rels" CASCADE;
  DROP TABLE "settings_socials" CASCADE;
  DROP TABLE "settings" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_photos_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_photos_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_photos_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_photos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_photos_fk";
  
  DROP INDEX "pages_rels_photos_id_idx";
  DROP INDEX "_pages_v_rels_photos_id_idx";
  DROP INDEX "posts_rels_photos_id_idx";
  DROP INDEX "_posts_v_rels_photos_id_idx";
  DROP INDEX "payload_locked_documents_rels_photos_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "photos_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "photos_id";
  ALTER TABLE "posts_rels" DROP COLUMN "photos_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "photos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "photos_id";
  DROP TYPE "public"."enum_photos_orientation";
  DROP TYPE "public"."enum_settings_socials_platform";
  DROP TYPE "public"."enum_settings_footer_date_time_display";`)
}
