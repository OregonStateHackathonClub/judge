/*
  Warnings:

  - The `images` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `userToTeams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `userToTeams` table. All the data in the column will be lost.
  - You are about to drop the `UserProfiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `judgeProfileId` to the `userToTeams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfiles" DROP CONSTRAINT "UserProfiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "userToTeams" DROP CONSTRAINT "userToTeams_userId_fkey";

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "images",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "contact" TEXT;

-- AlterTable
ALTER TABLE "userToTeams" DROP CONSTRAINT "userToTeams_pkey",
DROP COLUMN "userId",
ADD COLUMN     "judgeProfileId" TEXT NOT NULL,
ADD CONSTRAINT "userToTeams_pkey" PRIMARY KEY ("teamId", "judgeProfileId");

-- DropTable
DROP TABLE "UserProfiles";

-- CreateTable
CREATE TABLE "judgeProfile" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "judgeProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "judgeProfile" ADD CONSTRAINT "judgeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userToTeams" ADD CONSTRAINT "userToTeams_judgeProfileId_fkey" FOREIGN KEY ("judgeProfileId") REFERENCES "judgeProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
