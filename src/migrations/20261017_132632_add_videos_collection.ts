import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"captured_at" timestamp(3) with time zone,
  	"_key" varchar,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
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
  	"focal_y" numeric
  );
  
  ALTER TABLE "pages_blocks_film_reel_videos" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_blocks_film_reel_videos" ADD COLUMN "media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_filename_idx" ON "videos" USING btree ("filename");
  ALTER TABLE "pages_blocks_film_reel_videos" ADD CONSTRAINT "pages_blocks_film_reel_videos_media_id_videos_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_film_reel_videos" ADD CONSTRAINT "_pages_v_blocks_film_reel_videos_media_id_videos_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_film_reel_videos_media_idx" ON "pages_blocks_film_reel_videos" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_film_reel_videos_media_idx" ON "_pages_v_blocks_film_reel_videos" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "videos" CASCADE;
  ALTER TABLE "pages_blocks_film_reel_videos" DROP CONSTRAINT "pages_blocks_film_reel_videos_media_id_videos_id_fk";
  
  ALTER TABLE "_pages_v_blocks_film_reel_videos" DROP CONSTRAINT "_pages_v_blocks_film_reel_videos_media_id_videos_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_videos_fk";
  
  DROP INDEX "pages_blocks_film_reel_videos_media_idx";
  DROP INDEX "_pages_v_blocks_film_reel_videos_media_idx";
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  ALTER TABLE "pages_blocks_film_reel_videos" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_blocks_film_reel_videos" DROP COLUMN "media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";`)
}
