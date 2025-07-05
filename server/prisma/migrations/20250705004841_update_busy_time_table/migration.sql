/*
  Warnings:

  - Made the column `class_name` on table `busyTime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "busyTime" ALTER COLUMN "class_name" SET NOT NULL;
