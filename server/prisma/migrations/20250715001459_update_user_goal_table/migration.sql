/*
  Warnings:

  - The primary key for the `userGoals` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "userGoals" DROP CONSTRAINT "userGoals_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "userGoals_pkey" PRIMARY KEY ("id");
