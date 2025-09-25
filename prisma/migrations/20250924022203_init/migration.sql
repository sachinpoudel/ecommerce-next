/*
  Warnings:

  - You are about to drop the column `role` on the `admin` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."admin" DROP COLUMN "role";
