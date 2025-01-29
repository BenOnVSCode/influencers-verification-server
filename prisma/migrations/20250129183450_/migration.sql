-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('Verified', 'Questionable', 'Debunked', 'Null');

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date_range" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL,
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "twitter_handle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trend" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "influencers_twitter_handle_key" ON "influencers"("twitter_handle");

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "influencers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
