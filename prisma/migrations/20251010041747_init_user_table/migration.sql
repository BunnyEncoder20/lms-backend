-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('VICE_ADMIRAL', 'REAR_ADMIRAL', 'COMODOR', 'CAPTAIN', 'COMMANDER', 'LT_COMMANDER', 'LT', 'SUB_LT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN', 'OPERATOR', 'TRAINER', 'MAINTAINER', 'TRAINEE', 'ASSESSEE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "rank" "Rank" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
