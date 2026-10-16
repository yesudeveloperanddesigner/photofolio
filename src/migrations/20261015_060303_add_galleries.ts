import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "galleries_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_media_id" integer,
  	"image_url" varchar,
  	"image_alt" varchar,
  	"caption" varchar,
  	"meta" varchar
  );
  
  CREATE TABLE "galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_scroll_gallery" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "_pages_v_blocks_scroll_gallery" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "posts_blocks_scroll_gallery" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "_posts_v_blocks_scroll_gallery" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "galleries_id" integer;
  ALTER TABLE "galleries_images" ADD CONSTRAINT "galleries_images_image_media_id_media_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galleries_images" ADD CONSTRAINT "galleries_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "galleries_images_order_idx" ON "galleries_images" USING btree ("_order");
  CREATE INDEX "galleries_images_parent_id_idx" ON "galleries_images" USING btree ("_parent_id");
  CREATE INDEX "galleries_images_image_image_media_idx" ON "galleries_images" USING btree ("image_media_id");
  CREATE INDEX "galleries_slug_idx" ON "galleries" USING btree ("slug");
  CREATE INDEX "galleries_updated_at_idx" ON "galleries" USING btree ("updated_at");
  CREATE INDEX "galleries_created_at_idx" ON "galleries" USING btree ("created_at");
  ALTER TABLE "pages_blocks_scroll_gallery" ADD CONSTRAINT "pages_blocks_scroll_gallery_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scroll_gallery" ADD CONSTRAINT "_pages_v_blocks_scroll_gallery_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_scroll_gallery" ADD CONSTRAINT "posts_blocks_scroll_gallery_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_scroll_gallery" ADD CONSTRAINT "_posts_v_blocks_scroll_gallery_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galleries_fk" FOREIGN KEY ("galleries_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_scroll_gallery_gallery_idx" ON "pages_blocks_scroll_gallery" USING btree ("gallery_id");
  CREATE INDEX "_pages_v_blocks_scroll_gallery_gallery_idx" ON "_pages_v_blocks_scroll_gallery" USING btree ("gallery_id");
  CREATE INDEX "posts_blocks_scroll_gallery_gallery_idx" ON "posts_blocks_scroll_gallery" USING btree ("gallery_id");
  CREATE INDEX "_posts_v_blocks_scroll_gallery_gallery_idx" ON "_posts_v_blocks_scroll_gallery" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_galleries_id_idx" ON "payload_locked_documents_rels" USING btree ("galleries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "galleries_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "galleries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "galleries_images" CASCADE;
  DROP TABLE "galleries" CASCADE;
  ALTER TABLE "pages_blocks_scroll_gallery" DROP CONSTRAINT "pages_blocks_scroll_gallery_gallery_id_galleries_id_fk";
  
  ALTER TABLE "_pages_v_blocks_scroll_gallery" DROP CONSTRAINT "_pages_v_blocks_scroll_gallery_gallery_id_galleries_id_fk";
  
  ALTER TABLE "posts_blocks_scroll_gallery" DROP CONSTRAINT "posts_blocks_scroll_gallery_gallery_id_galleries_id_fk";
  
  ALTER TABLE "_posts_v_blocks_scroll_gallery" DROP CONSTRAINT "_posts_v_blocks_scroll_gallery_gallery_id_galleries_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_galleries_fk";
  
  DROP INDEX "pages_blocks_scroll_gallery_gallery_idx";
  DROP INDEX "_pages_v_blocks_scroll_gallery_gallery_idx";
  DROP INDEX "posts_blocks_scroll_gallery_gallery_idx";
  DROP INDEX "_posts_v_blocks_scroll_gallery_gallery_idx";
  DROP INDEX "payload_locked_documents_rels_galleries_id_idx";
  ALTER TABLE "pages_blocks_scroll_gallery" DROP COLUMN "gallery_id";
  ALTER TABLE "_pages_v_blocks_scroll_gallery" DROP COLUMN "gallery_id";
  ALTER TABLE "posts_blocks_scroll_gallery" DROP COLUMN "gallery_id";
  ALTER TABLE "_posts_v_blocks_scroll_gallery" DROP COLUMN "gallery_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "galleries_id";`)
}
