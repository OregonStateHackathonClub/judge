-- CreateTable
CREATE TABLE "hackathons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "sponsors" TEXT NOT NULL,
    "rubric" JSONB NOT NULL,
    "description" TEXT,

    CONSTRAINT "hackathons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "userToTeams" (
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "userToTeams_pkey" PRIMARY KEY ("teamId","userId")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "githubURL" TEXT NOT NULL,
    "ytVideo" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "rubric" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "hackathonId" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,

    CONSTRAINT "track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mergeTrack" (
    "trackId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "mergeTrack_pkey" PRIMARY KEY ("trackId","submissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "hackathons_name_key" ON "hackathons"("name");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userToTeams" ADD CONSTRAINT "userToTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userToTeams" ADD CONSTRAINT "userToTeams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track" ADD CONSTRAINT "track_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mergeTrack" ADD CONSTRAINT "mergeTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mergeTrack" ADD CONSTRAINT "mergeTrack_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
