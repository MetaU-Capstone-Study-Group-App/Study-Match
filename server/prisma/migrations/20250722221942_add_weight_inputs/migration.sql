-- AlterTable
ALTER TABLE "users" ADD COLUMN     "class_standing_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
ADD COLUMN     "goals_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
ADD COLUMN     "location_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
ADD COLUMN     "personality_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
ADD COLUMN     "school_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.1;
