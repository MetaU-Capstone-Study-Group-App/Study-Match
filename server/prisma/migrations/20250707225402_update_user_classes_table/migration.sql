/*
  Warnings:

  - The primary key for the `userClasses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `userClasses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userClasses" DROP CONSTRAINT "userClasses_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "userClasses_pkey" PRIMARY KEY ("id");
