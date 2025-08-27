-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_submissionId_fkey";

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "leaderId" TEXT,
ALTER COLUMN "submissionId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserProfiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,

    CONSTRAINT "UserProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfiles_userId_appId_key" ON "UserProfiles"("userId", "appId");

-- AddForeignKey
ALTER TABLE "UserProfiles" ADD CONSTRAINT "UserProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
