-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('VICE_ADMIRAL', 'REAR_ADMIRAL', 'COMODOR', 'CAPTAIN', 'COMMANDER', 'LT_COMMANDER', 'LT', 'SUB_LT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN', 'OPERATOR', 'TRAINER', 'MAINTAINER', 'TRAINEE', 'ASSESSEE');

-- CreateTable
CREATE TABLE "User" (
    "personalNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "rank" "Rank" NOT NULL,
    "role" "Role" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshTokenHash" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastPasswordChangeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("personalNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_personalNumber_key" ON "User"("personalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
