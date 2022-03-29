/*
  Warnings:

  - You are about to drop the column `datum` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "datum",
ADD COLUMN     "endDate" TEXT NOT NULL,
ADD COLUMN     "startDate" TEXT NOT NULL;
