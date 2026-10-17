import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_film_reel_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"meta" varchar
  );
  
  CREATE TABLE "pages_blocks_film_reel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'On commission',
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_film_reel_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"label" varchar,
  	"meta" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_film_reel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'On commission',
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_film_reel_videos" ADD CONSTRAINT "pages_blocks_film_reel_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_film_reel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_film_reel" ADD CONSTRAINT "pages_blocks_film_reel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_film_reel_videos" ADD CONSTRAINT "_pages_v_blocks_film_reel_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_film_reel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_film_reel" ADD CONSTRAINT "_pages_v_blocks_film_reel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_film_reel_videos_order_idx" ON "pages_blocks_film_reel_videos" USING btree ("_order");
  CREATE INDEX "pages_blocks_film_reel_videos_parent_id_idx" ON "pages_blocks_film_reel_videos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_film_reel_order_idx" ON "pages_blocks_film_reel" USING btree ("_order");
  CREATE INDEX "pages_blocks_film_reel_parent_id_idx" ON "pages_blocks_film_reel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_film_reel_path_idx" ON "pages_blocks_film_reel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_film_reel_videos_order_idx" ON "_pages_v_blocks_film_reel_videos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_film_reel_videos_parent_id_idx" ON "_pages_v_blocks_film_reel_videos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_film_reel_order_idx" ON "_pages_v_blocks_film_reel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_film_reel_parent_id_idx" ON "_pages_v_blocks_film_reel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_film_reel_path_idx" ON "_pages_v_blocks_film_reel" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_film_reel_videos" CASCADE;
  DROP TABLE "pages_blocks_film_reel" CASCADE;
  DROP TABLE "_pages_v_blocks_film_reel_videos" CASCADE;
  DROP TABLE "_pages_v_blocks_film_reel" CASCADE;`)
}
