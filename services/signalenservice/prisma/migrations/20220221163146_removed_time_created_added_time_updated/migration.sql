/*
  Warnings:

  - You are about to drop the column `timeCreated` on the `Signal` table. All the data in the column will be lost.
  - Added the required column `timeUpdated` to the `Signal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Signal" DROP COLUMN "timeCreated",
ADD COLUMN     "timeUpdated" TIMESTAMP(3) NOT NULL;
