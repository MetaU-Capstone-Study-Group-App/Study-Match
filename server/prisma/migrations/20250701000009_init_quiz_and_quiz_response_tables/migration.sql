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

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quizResponses" ADD CONSTRAINT "quizResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
