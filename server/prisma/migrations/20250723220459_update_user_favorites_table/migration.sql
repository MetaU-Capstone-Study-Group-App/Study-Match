/*
  Warnings:

  - You are about to drop the `UserFavorite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFavorite" DROP CONSTRAINT "UserFavorite_logged_in_user_fkey";

-- DropTable
DROP TABLE "UserFavorite";

-- CreateTable
CREATE TABLE "userFavorites" (
    "id" SERIAL NOT NULL,
    "logged_in_user" INTEGER NOT NULL,
    "favorite_user" INTEGER NOT NULL,

    CONSTRAINT "userFavorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userFavorites" ADD CONSTRAINT "userFavorites_logged_in_user_fkey" FOREIGN KEY ("logged_in_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
