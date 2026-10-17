import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_practice_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'website', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_practice_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'website', 'other');
  CREATE TABLE "pages_blocks_practice_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_practice_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_practice_socials_platform" DEFAULT 'instagram',
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_practice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_location" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_practice_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_practice_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__pages_v_blocks_practice_socials_platform" DEFAULT 'instagram',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_practice" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_location" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_photographer_profile_skills" CASCADE;
  DROP TABLE "pages_blocks_photographer_profile_socials" CASCADE;
  DROP TABLE "_pages_v_blocks_photographer_profile_skills" CASCADE;
  DROP TABLE "_pages_v_blocks_photographer_profile_socials" CASCADE;
  DROP TABLE "posts_blocks_photographer_profile_skills" CASCADE;
  DROP TABLE "posts_blocks_photographer_profile_socials" CASCADE;
  DROP TABLE "_posts_v_blocks_photographer_profile_skills" CASCADE;
  DROP TABLE "_posts_v_blocks_photographer_profile_socials" CASCADE;
  ALTER TABLE "pages_blocks_practice_skills" ADD CONSTRAINT "pages_blocks_practice_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_practice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_practice_socials" ADD CONSTRAINT "pages_blocks_practice_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_practice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_practice" ADD CONSTRAINT "pages_blocks_practice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_practice_skills" ADD CONSTRAINT "_pages_v_blocks_practice_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_practice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_practice_socials" ADD CONSTRAINT "_pages_v_blocks_practice_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_practice"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_practice" ADD CONSTRAINT "_pages_v_blocks_practice_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_practice_skills_order_idx" ON "pages_blocks_practice_skills" USING btree ("_order");
  CREATE INDEX "pages_blocks_practice_skills_parent_id_idx" ON "pages_blocks_practice_skills" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_practice_socials_order_idx" ON "pages_blocks_practice_socials" USING btree ("_order");
  CREATE INDEX "pages_blocks_practice_socials_parent_id_idx" ON "pages_blocks_practice_socials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_practice_order_idx" ON "pages_blocks_practice" USING btree ("_order");
  CREATE INDEX "pages_blocks_practice_parent_id_idx" ON "pages_blocks_practice" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_practice_path_idx" ON "pages_blocks_practice" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_practice_skills_order_idx" ON "_pages_v_blocks_practice_skills" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_practice_skills_parent_id_idx" ON "_pages_v_blocks_practice_skills" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_practice_socials_order_idx" ON "_pages_v_blocks_practice_socials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_practice_socials_parent_id_idx" ON "_pages_v_blocks_practice_socials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_practice_order_idx" ON "_pages_v_blocks_practice" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_practice_parent_id_idx" ON "_pages_v_blocks_practice" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_practice_path_idx" ON "_pages_v_blocks_practice" USING btree ("_path");
  ALTER TABLE "pages_blocks_photographer_profile" DROP COLUMN "contact_email";
  ALTER TABLE "pages_blocks_photographer_profile" DROP COLUMN "contact_phone";
  ALTER TABLE "pages_blocks_photographer_profile" DROP COLUMN "contact_location";
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP COLUMN "contact_email";
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP COLUMN "contact_phone";
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP COLUMN "contact_location";
  ALTER TABLE "posts_blocks_photographer_profile" DROP COLUMN "contact_email";
  ALTER TABLE "posts_blocks_photographer_profile" DROP COLUMN "contact_phone";
  ALTER TABLE "posts_blocks_photographer_profile" DROP COLUMN "contact_location";
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP COLUMN "contact_email";
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP COLUMN "contact_phone";
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP COLUMN "contact_location";
  DROP TYPE "public"."enum_pages_blocks_photographer_profile_socials_platform";
  DROP TYPE "public"."enum__pages_v_blocks_photographer_profile_socials_platform";
  DROP TYPE "public"."enum_posts_blocks_photographer_profile_socials_platform";
  DROP TYPE "public"."enum__posts_v_blocks_photographer_profile_socials_platform";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_photographer_profile_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'website', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_photographer_profile_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'website', 'other');
  CREATE TYPE "public"."enum_posts_blocks_photographer_profile_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'website', 'other');
  CREATE TYPE "public"."enum__posts_v_blocks_photographer_profile_socials_platform" AS ENUM('instagram', 'behance', 'x', 'linkedin', 'vimeo', 'website', 'other');
  CREATE TABLE "pages_blocks_photographer_profile_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_photographer_profile_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_photographer_profile_socials_platform" DEFAULT 'instagram',
  	"url" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photographer_profile_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photographer_profile_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__pages_v_blocks_photographer_profile_socials_platform" DEFAULT 'instagram',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "posts_blocks_photographer_profile_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "posts_blocks_photographer_profile_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_posts_blocks_photographer_profile_socials_platform" DEFAULT 'instagram',
  	"url" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_photographer_profile_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_photographer_profile_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__posts_v_blocks_photographer_profile_socials_platform" DEFAULT 'instagram',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  DROP TABLE "pages_blocks_practice_skills" CASCADE;
  DROP TABLE "pages_blocks_practice_socials" CASCADE;
  DROP TABLE "pages_blocks_practice" CASCADE;
  DROP TABLE "_pages_v_blocks_practice_skills" CASCADE;
  DROP TABLE "_pages_v_blocks_practice_socials" CASCADE;
  DROP TABLE "_pages_v_blocks_practice" CASCADE;
  ALTER TABLE "pages_blocks_photographer_profile" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "pages_blocks_photographer_profile" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "pages_blocks_photographer_profile" ADD COLUMN "contact_location" varchar;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD COLUMN "contact_location" varchar;
  ALTER TABLE "posts_blocks_photographer_profile" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "posts_blocks_photographer_profile" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "posts_blocks_photographer_profile" ADD COLUMN "contact_location" varchar;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD COLUMN "contact_location" varchar;
  ALTER TABLE "pages_blocks_photographer_profile_skills" ADD CONSTRAINT "pages_blocks_photographer_profile_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_photographer_profile_socials" ADD CONSTRAINT "pages_blocks_photographer_profile_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photographer_profile_skills" ADD CONSTRAINT "_pages_v_blocks_photographer_profile_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photographer_profile_socials" ADD CONSTRAINT "_pages_v_blocks_photographer_profile_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_photographer_profile_skills" ADD CONSTRAINT "posts_blocks_photographer_profile_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_photographer_profile_socials" ADD CONSTRAINT "posts_blocks_photographer_profile_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_photographer_profile_skills" ADD CONSTRAINT "_posts_v_blocks_photographer_profile_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_photographer_profile_socials" ADD CONSTRAINT "_posts_v_blocks_photographer_profile_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_photographer_profile_skills_order_idx" ON "pages_blocks_photographer_profile_skills" USING btree ("_order");
  CREATE INDEX "pages_blocks_photographer_profile_skills_parent_id_idx" ON "pages_blocks_photographer_profile_skills" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photographer_profile_socials_order_idx" ON "pages_blocks_photographer_profile_socials" USING btree ("_order");
  CREATE INDEX "pages_blocks_photographer_profile_socials_parent_id_idx" ON "pages_blocks_photographer_profile_socials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photographer_profile_skills_order_idx" ON "_pages_v_blocks_photographer_profile_skills" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photographer_profile_skills_parent_id_idx" ON "_pages_v_blocks_photographer_profile_skills" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photographer_profile_socials_order_idx" ON "_pages_v_blocks_photographer_profile_socials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photographer_profile_socials_parent_id_idx" ON "_pages_v_blocks_photographer_profile_socials" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_photographer_profile_skills_order_idx" ON "posts_blocks_photographer_profile_skills" USING btree ("_order");
  CREATE INDEX "posts_blocks_photographer_profile_skills_parent_id_idx" ON "posts_blocks_photographer_profile_skills" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_photographer_profile_socials_order_idx" ON "posts_blocks_photographer_profile_socials" USING btree ("_order");
  CREATE INDEX "posts_blocks_photographer_profile_socials_parent_id_idx" ON "posts_blocks_photographer_profile_socials" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_photographer_profile_skills_order_idx" ON "_posts_v_blocks_photographer_profile_skills" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_photographer_profile_skills_parent_id_idx" ON "_posts_v_blocks_photographer_profile_skills" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_photographer_profile_socials_order_idx" ON "_posts_v_blocks_photographer_profile_socials" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_photographer_profile_socials_parent_id_idx" ON "_posts_v_blocks_photographer_profile_socials" USING btree ("_parent_id");
  DROP TYPE "public"."enum_pages_blocks_practice_socials_platform";
  DROP TYPE "public"."enum__pages_v_blocks_practice_socials_platform";`)
}
