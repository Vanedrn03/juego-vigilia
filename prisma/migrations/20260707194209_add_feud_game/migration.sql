-- CreateEnum
CREATE TYPE "FeudRoundPhase" AS ENUM ('FACEOFF', 'PLAYING', 'STEAL', 'DONE');

-- CreateEnum
CREATE TYPE "FeudTeam" AS ENUM ('TEAM_A', 'TEAM_B');

-- CreateTable
CREATE TABLE "FeudQuestion" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeudQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeudAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "FeudAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeudSession" (
    "id" TEXT NOT NULL,
    "teamAName" TEXT NOT NULL,
    "teamBName" TEXT NOT NULL,
    "teamAScore" INTEGER NOT NULL DEFAULT 0,
    "teamBScore" INTEGER NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'SETUP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeudSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeudSessionRound" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "phase" "FeudRoundPhase" NOT NULL DEFAULT 'FACEOFF',
    "controllingTeam" "FeudTeam",
    "strikes" INTEGER NOT NULL DEFAULT 0,
    "revealedAnswerIds" JSONB NOT NULL DEFAULT '[]',
    "pot" INTEGER NOT NULL DEFAULT 0,
    "wonBy" "FeudTeam",

    CONSTRAINT "FeudSessionRound_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeudAnswer_questionId_rank_key" ON "FeudAnswer"("questionId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "FeudSessionRound_sessionId_roundNumber_key" ON "FeudSessionRound"("sessionId", "roundNumber");

-- AddForeignKey
ALTER TABLE "FeudAnswer" ADD CONSTRAINT "FeudAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FeudQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeudSessionRound" ADD CONSTRAINT "FeudSessionRound_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "FeudSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeudSessionRound" ADD CONSTRAINT "FeudSessionRound_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FeudQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
