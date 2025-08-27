/*
  Warnings:

  - Added the required column `status` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "miniDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "bio" SET DEFAULT '',
ALTER COLUMN "githubURL" SET DEFAULT '',
ALTER COLUMN "ytVideo" SET DEFAULT '',
ALTER COLUMN "images" SET DEFAULT '',
ALTER COLUMN "comments" SET DEFAULT '',
ALTER COLUMN "rubric" SET DEFAULT '{}',
ALTER COLUMN "score" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "lookingForTeammates" SET DEFAULT false;
