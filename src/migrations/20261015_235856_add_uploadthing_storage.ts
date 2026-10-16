import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "_key" varchar;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_square__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_small__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_medium__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "_key" varchar;
  ALTER TABLE "photos" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "photos" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_thumbnail__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_square__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_small__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_medium__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_large__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_xlarge__key" varchar;
  ALTER TABLE "photos" ADD COLUMN "sizes_og__key" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "_key";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail__key";
  ALTER TABLE "media" DROP COLUMN "sizes_square__key";
  ALTER TABLE "media" DROP COLUMN "sizes_small__key";
  ALTER TABLE "media" DROP COLUMN "sizes_medium__key";
  ALTER TABLE "media" DROP COLUMN "sizes_large__key";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge__key";
  ALTER TABLE "media" DROP COLUMN "sizes_og__key";
  ALTER TABLE "photos" DROP COLUMN "_key";
  ALTER TABLE "photos" DROP COLUMN "prefix";
  ALTER TABLE "photos" DROP COLUMN "_objectkey";
  ALTER TABLE "photos" DROP COLUMN "sizes_thumbnail__key";
  ALTER TABLE "photos" DROP COLUMN "sizes_square__key";
  ALTER TABLE "photos" DROP COLUMN "sizes_small__key";
  ALTER TABLE "photos" DROP COLUMN "sizes_medium__key";
  ALTER TABLE "photos" DROP COLUMN "sizes_large__key";
  ALTER TABLE "photos" DROP COLUMN "sizes_xlarge__key";
  ALTER TABLE "photos" DROP COLUMN "sizes_og__key";`)
}
