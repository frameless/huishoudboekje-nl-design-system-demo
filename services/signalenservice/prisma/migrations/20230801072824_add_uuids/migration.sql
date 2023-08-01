/*
  Warnings:

  - Added the required column `alarmUuid` to the `Signal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Signal" ADD COLUMN     "alarmUuid" TEXT,
ADD COLUMN     "banktransactieUuids" TEXT[];
