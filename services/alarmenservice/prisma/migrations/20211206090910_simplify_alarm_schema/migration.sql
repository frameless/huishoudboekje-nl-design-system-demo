/*
  Warnings:

  - You are about to drop the column `ruleId` on the `Alarm` table. All the data in the column will be lost.
  - You are about to drop the column `schemaId` on the `Alarm` table. All the data in the column will be lost.
  - You are about to drop the `AlarmSchema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `AlarmStatus` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrag` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedragMargin` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datum` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datumMargin` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlarmStatus" AS ENUM ('Active', 'Inactive');

-- DropForeignKey
ALTER TABLE "Alarm" DROP CONSTRAINT "Alarm_ruleId_fkey";

-- DropForeignKey
ALTER TABLE "Alarm" DROP CONSTRAINT "Alarm_schemaId_fkey";

-- DropIndex
DROP INDEX "Alarm_ruleId_key";

-- DropIndex
DROP INDEX "Alarm_schemaId_key";

-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "ruleId",
DROP COLUMN "schemaId",
ADD COLUMN     "AlarmStatus" "AlarmStatus" NOT NULL,
ADD COLUMN     "bedrag" TEXT NOT NULL,
ADD COLUMN     "bedragMargin" TEXT NOT NULL,
ADD COLUMN     "datum" TEXT NOT NULL,
ADD COLUMN     "datumMargin" INTEGER NOT NULL;

-- DropTable
DROP TABLE "AlarmSchema";

-- DropTable
DROP TABLE "Rule";

-- DropEnum
DROP TYPE "DayOfWeek";
