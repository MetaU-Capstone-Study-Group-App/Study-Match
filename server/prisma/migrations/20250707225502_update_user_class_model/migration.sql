-- AlterTable
CREATE SEQUENCE userclasses_id_seq;
ALTER TABLE "userClasses" ALTER COLUMN "id" SET DEFAULT nextval('userclasses_id_seq');
ALTER SEQUENCE userclasses_id_seq OWNED BY "userClasses"."id";
