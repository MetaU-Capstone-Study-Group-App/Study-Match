-- CreateTable
CREATE TABLE "goalOptions" (
    "id" SERIAL NOT NULL,
    "goal" TEXT NOT NULL,

    CONSTRAINT "goalOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userGoals" (
    "user_id" INTEGER NOT NULL,
    "goal_id" INTEGER NOT NULL,

    CONSTRAINT "userGoals_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "userGoals" ADD CONSTRAINT "userGoals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userGoals" ADD CONSTRAINT "userGoals_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goalOptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
