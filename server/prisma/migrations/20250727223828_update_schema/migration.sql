-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" BYTEA,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferred_start_time" TEXT,
    "preferred_end_time" TEXT,
    "school" TEXT,
    "address_latitude" DOUBLE PRECISION,
    "address_longitude" DOUBLE PRECISION,
    "class_standing" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "personality_weight" DOUBLE PRECISION DEFAULT 0.2,
    "location_weight" DOUBLE PRECISION DEFAULT 0.4,
    "goals_weight" DOUBLE PRECISION DEFAULT 0.2,
    "school_weight" DOUBLE PRECISION DEFAULT 0.1,
    "class_standing_weight" DOUBLE PRECISION DEFAULT 0.1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizResponses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "question_trait" TEXT NOT NULL,
    "response" INTEGER NOT NULL,

    CONSTRAINT "quizResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "busyTime" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,

    CONSTRAINT "busyTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userClasses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "userClasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "existingGroups" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "study_goals" TEXT,

    CONSTRAINT "existingGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userExistingGroups" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "existing_group_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "recommended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "userExistingGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goalOptions" (
    "id" SERIAL NOT NULL,
    "goal" TEXT NOT NULL,

    CONSTRAINT "goalOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userGoals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "goal_id" INTEGER NOT NULL,

    CONSTRAINT "userGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userFavorites" (
    "id" SERIAL NOT NULL,
    "logged_in_user" INTEGER NOT NULL,
    "favorite_user" INTEGER NOT NULL,

    CONSTRAINT "userFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quizResponses" ADD CONSTRAINT "quizResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "busyTime" ADD CONSTRAINT "busyTime_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userClasses" ADD CONSTRAINT "userClasses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userClasses" ADD CONSTRAINT "userClasses_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userExistingGroups" ADD CONSTRAINT "userExistingGroups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userExistingGroups" ADD CONSTRAINT "userExistingGroups_existing_group_id_fkey" FOREIGN KEY ("existing_group_id") REFERENCES "existingGroups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userGoals" ADD CONSTRAINT "userGoals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userGoals" ADD CONSTRAINT "userGoals_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goalOptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userFavorites" ADD CONSTRAINT "userFavorites_logged_in_user_fkey" FOREIGN KEY ("logged_in_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
