/*
  Warnings:

  - Added the required column `afspraakId` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" ADD COLUMN     "afspraakId" INTEGER NOT NULL;
