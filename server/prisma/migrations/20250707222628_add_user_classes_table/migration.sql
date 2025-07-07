-- CreateTable
CREATE TABLE "userClasses" (
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "userClasses_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "userClasses" ADD CONSTRAINT "userClasses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userClasses" ADD CONSTRAINT "userClasses_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
