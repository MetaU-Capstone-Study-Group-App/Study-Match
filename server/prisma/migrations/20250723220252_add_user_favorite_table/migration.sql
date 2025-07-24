-- CreateTable
CREATE TABLE "UserFavorite" (
    "id" SERIAL NOT NULL,
    "logged_in_user" INTEGER NOT NULL,
    "favorite_user" INTEGER NOT NULL,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_logged_in_user_fkey" FOREIGN KEY ("logged_in_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
