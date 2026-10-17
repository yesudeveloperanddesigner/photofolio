import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_film_reel_source" AS ENUM('library', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_film_reel_source" AS ENUM('library', 'manual');
  ALTER TABLE "pages_blocks_film_reel" ADD COLUMN "source" "enum_pages_blocks_film_reel_source" DEFAULT 'library';
  ALTER TABLE "_pages_v_blocks_film_reel" ADD COLUMN "source" "enum__pages_v_blocks_film_reel_source" DEFAULT 'library';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_film_reel" DROP COLUMN "source";
  ALTER TABLE "_pages_v_blocks_film_reel" DROP COLUMN "source";
  DROP TYPE "public"."enum_pages_blocks_film_reel_source";
  DROP TYPE "public"."enum__pages_v_blocks_film_reel_source";`)
}
