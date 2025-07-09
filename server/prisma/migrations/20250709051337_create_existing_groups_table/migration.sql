-- CreateTable
CREATE TABLE "existingGroups" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "existingGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExistingGroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExistingGroupToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ExistingGroupToUser_B_index" ON "_ExistingGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "_ExistingGroupToUser" ADD CONSTRAINT "_ExistingGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "existingGroups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExistingGroupToUser" ADD CONSTRAINT "_ExistingGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
