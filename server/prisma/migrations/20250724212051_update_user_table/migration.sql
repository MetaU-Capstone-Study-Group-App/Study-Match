-- AlterTable
ALTER TABLE "users" ALTER COLUMN "class_standing_weight" DROP NOT NULL,
ALTER COLUMN "goals_weight" DROP NOT NULL,
ALTER COLUMN "location_weight" DROP NOT NULL,
ALTER COLUMN "personality_weight" DROP NOT NULL,
ALTER COLUMN "school_weight" DROP NOT NULL;
