-- CreateTable
CREATE TABLE "busyTimes" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "busyTimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "busyTime" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,

    CONSTRAINT "busyTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "busyTimes" ADD CONSTRAINT "busyTimes_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "busyTime" ADD CONSTRAINT "busyTime_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "busyTimes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
