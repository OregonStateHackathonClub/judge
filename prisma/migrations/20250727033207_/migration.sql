-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "description" TEXT,
ADD COLUMN     "lookingForTeammates" BOOLEAN NOT NULL DEFAULT true;
