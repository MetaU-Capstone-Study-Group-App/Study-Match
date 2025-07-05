/*
  Warnings:

  - You are about to drop the `busyTimes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "busyTime" DROP CONSTRAINT "busyTime_user_id_fkey";

-- DropForeignKey
ALTER TABLE "busyTimes" DROP CONSTRAINT "busyTimes_id_fkey";

-- DropTable
DROP TABLE "busyTimes";

-- AddForeignKey
ALTER TABLE "busyTime" ADD CONSTRAINT "busyTime_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
