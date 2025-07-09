/*
  Warnings:

  - You are about to drop the `_ExistingGroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExistingGroupToUser" DROP CONSTRAINT "_ExistingGroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExistingGroupToUser" DROP CONSTRAINT "_ExistingGroupToUser_B_fkey";

-- DropTable
DROP TABLE "_ExistingGroupToUser";

-- CreateTable
CREATE TABLE "userExistingGroups" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "existing_group_id" INTEGER NOT NULL,

    CONSTRAINT "userExistingGroups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userExistingGroups" ADD CONSTRAINT "userExistingGroups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userExistingGroups" ADD CONSTRAINT "userExistingGroups_existing_group_id_fkey" FOREIGN KEY ("existing_group_id") REFERENCES "existingGroups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
