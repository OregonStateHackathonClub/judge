/*
  Warnings:

  - You are about to drop the column `year` on the `hackathons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hackathons" DROP COLUMN "year";

-- CreateTable
CREATE TABLE "Invites" (
    "teamId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "Invites_teamId_idx" ON "Invites"("teamId");

-- AddForeignKey
ALTER TABLE "Invites" ADD CONSTRAINT "Invites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
