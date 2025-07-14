/*
  Warnings:

  - You are about to drop the column `zip_code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "zip_code",
ADD COLUMN     "address_latitude" DOUBLE PRECISION,
ADD COLUMN     "address_longitude" DOUBLE PRECISION;
