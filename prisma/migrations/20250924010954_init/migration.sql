/*
  Warnings:

  - Added the required column `name` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_name_key";

-- AlterTable
ALTER TABLE "public"."admin" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin';
