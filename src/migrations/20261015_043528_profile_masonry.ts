import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_photographer_profile_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_photographer_profile_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "posts_blocks_photographer_profile_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_photographer_profile_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_photographer_profile" DROP CONSTRAINT "pages_blocks_photographer_profile_portrait_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP CONSTRAINT "_pages_v_blocks_photographer_profile_portrait_media_id_media_id_fk";
  
  ALTER TABLE "posts_blocks_photographer_profile" DROP CONSTRAINT "posts_blocks_photographer_profile_portrait_media_id_media_id_fk";
  
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP CONSTRAINT "_posts_v_blocks_photographer_profile_portrait_media_id_media_id_fk";
  
  DROP INDEX "pages_blocks_photographer_profile_portrait_portrait_medi_idx";
  DROP INDEX "_pages_v_blocks_photographer_profile_portrait_portrait_m_idx";
  DROP INDEX "posts_blocks_photographer_profile_portrait_portrait_medi_idx";
  DROP INDEX "_posts_v_blocks_photographer_profile_portrait_portrait_m_idx";
  ALTER TABLE "pages_blocks_photographer_profile_images" ADD CONSTRAINT "pages_blocks_photographer_profile_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_photographer_profile_images" ADD CONSTRAINT "pages_blocks_photographer_profile_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photographer_profile_images" ADD CONSTRAINT "_pages_v_blocks_photographer_profile_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photographer_profile_images" ADD CONSTRAINT "_pages_v_blocks_photographer_profile_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_photographer_profile_images" ADD CONSTRAINT "posts_blocks_photographer_profile_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_photographer_profile_images" ADD CONSTRAINT "posts_blocks_photographer_profile_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_photographer_profile_images" ADD CONSTRAINT "_posts_v_blocks_photographer_profile_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_photographer_profile_images" ADD CONSTRAINT "_posts_v_blocks_photographer_profile_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_photographer_profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_photographer_profile_images_order_idx" ON "pages_blocks_photographer_profile_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_photographer_profile_images_parent_id_idx" ON "pages_blocks_photographer_profile_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_photographer_profile_images_image_image_med_idx" ON "pages_blocks_photographer_profile_images" USING btree ("image_media_id");
  CREATE INDEX "_pages_v_blocks_photographer_profile_images_order_idx" ON "_pages_v_blocks_photographer_profile_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_photographer_profile_images_parent_id_idx" ON "_pages_v_blocks_photographer_profile_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_photographer_profile_images_image_image__idx" ON "_pages_v_blocks_photographer_profile_images" USING btree ("image_media_id");
  CREATE INDEX "posts_blocks_photographer_profile_images_order_idx" ON "posts_blocks_photographer_profile_images" USING btree ("_order");
  CREATE INDEX "posts_blocks_photographer_profile_images_parent_id_idx" ON "posts_blocks_photographer_profile_images" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_photographer_profile_images_image_image_med_idx" ON "posts_blocks_photographer_profile_images" USING btree ("image_media_id");
  CREATE INDEX "_posts_v_blocks_photographer_profile_images_order_idx" ON "_posts_v_blocks_photographer_profile_images" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_photographer_profile_images_parent_id_idx" ON "_posts_v_blocks_photographer_profile_images" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_photographer_profile_images_image_image__idx" ON "_posts_v_blocks_photographer_profile_images" USING btree ("image_media_id");
  ALTER TABLE "pages_blocks_photographer_profile" DROP COLUMN "portrait_media_id";
  ALTER TABLE "pages_blocks_photographer_profile" DROP COLUMN "portrait_url";
  ALTER TABLE "pages_blocks_photographer_profile" DROP COLUMN "portrait_alt";
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP COLUMN "portrait_media_id";
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP COLUMN "portrait_url";
  ALTER TABLE "_pages_v_blocks_photographer_profile" DROP COLUMN "portrait_alt";
  ALTER TABLE "posts_blocks_photographer_profile" DROP COLUMN "portrait_media_id";
  ALTER TABLE "posts_blocks_photographer_profile" DROP COLUMN "portrait_url";
  ALTER TABLE "posts_blocks_photographer_profile" DROP COLUMN "portrait_alt";
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP COLUMN "portrait_media_id";
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP COLUMN "portrait_url";
  ALTER TABLE "_posts_v_blocks_photographer_profile" DROP COLUMN "portrait_alt";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_photographer_profile_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_photographer_profile_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_photographer_profile_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_photographer_profile_images" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_photographer_profile_images" CASCADE;
  DROP TABLE "_pages_v_blocks_photographer_profile_images" CASCADE;
  DROP TABLE "posts_blocks_photographer_profile_images" CASCADE;
  DROP TABLE "_posts_v_blocks_photographer_profile_images" CASCADE;
  ALTER TABLE "pages_blocks_photographer_profile" ADD COLUMN "portrait_media_id" integer;
  ALTER TABLE "pages_blocks_photographer_profile" ADD COLUMN "portrait_url" varchar;
  ALTER TABLE "pages_blocks_photographer_profile" ADD COLUMN "portrait_alt" varchar;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD COLUMN "portrait_media_id" integer;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD COLUMN "portrait_url" varchar;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD COLUMN "portrait_alt" varchar;
  ALTER TABLE "posts_blocks_photographer_profile" ADD COLUMN "portrait_media_id" integer;
  ALTER TABLE "posts_blocks_photographer_profile" ADD COLUMN "portrait_url" varchar;
  ALTER TABLE "posts_blocks_photographer_profile" ADD COLUMN "portrait_alt" varchar;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD COLUMN "portrait_media_id" integer;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD COLUMN "portrait_url" varchar;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD COLUMN "portrait_alt" varchar;
  ALTER TABLE "pages_blocks_photographer_profile" ADD CONSTRAINT "pages_blocks_photographer_profile_portrait_media_id_media_id_fk" FOREIGN KEY ("portrait_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_photographer_profile" ADD CONSTRAINT "_pages_v_blocks_photographer_profile_portrait_media_id_media_id_fk" FOREIGN KEY ("portrait_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_photographer_profile" ADD CONSTRAINT "posts_blocks_photographer_profile_portrait_media_id_media_id_fk" FOREIGN KEY ("portrait_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_photographer_profile" ADD CONSTRAINT "_posts_v_blocks_photographer_profile_portrait_media_id_media_id_fk" FOREIGN KEY ("portrait_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_photographer_profile_portrait_portrait_medi_idx" ON "pages_blocks_photographer_profile" USING btree ("portrait_media_id");
  CREATE INDEX "_pages_v_blocks_photographer_profile_portrait_portrait_m_idx" ON "_pages_v_blocks_photographer_profile" USING btree ("portrait_media_id");
  CREATE INDEX "posts_blocks_photographer_profile_portrait_portrait_medi_idx" ON "posts_blocks_photographer_profile" USING btree ("portrait_media_id");
  CREATE INDEX "_posts_v_blocks_photographer_profile_portrait_portrait_m_idx" ON "_posts_v_blocks_photographer_profile" USING btree ("portrait_media_id");`)
}
