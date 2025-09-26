-- AlterTable
ALTER TABLE "public"."admin" ADD COLUMN     "level" TEXT NOT NULL DEFAULT 'None';

-- DropEnum
DROP TYPE "public"."role";
