/*
  Warnings:

  - The `images` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `status` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_submissionId_fkey";

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "bio" SET DEFAULT '',
ALTER COLUMN "githubURL" SET DEFAULT '',
ALTER COLUMN "ytVideo" SET DEFAULT '',
DROP COLUMN "images",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "comments" SET DEFAULT '',
ALTER COLUMN "rubric" SET DEFAULT '{}',
ALTER COLUMN "score" SET DEFAULT 0;

ALTER TABLE "teams" 
-- "leaderId" column already added in a previous migration
ALTER COLUMN   "submissionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
