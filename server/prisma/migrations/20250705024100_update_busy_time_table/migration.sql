/*
  Warnings:

  - Changed the type of `day_of_week` on the `busyTime` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "busyTime" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" INTEGER NOT NULL;
