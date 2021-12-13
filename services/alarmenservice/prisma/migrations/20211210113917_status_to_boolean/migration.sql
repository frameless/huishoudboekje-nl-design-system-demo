/*
  Warnings:

  - You are about to drop the column `status` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "status",
ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "AlarmStatus";
