-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterTable
ALTER TABLE "Alarm" ADD COLUMN     "byDay" "DayOfWeek"[],
ADD COLUMN     "byMonth" INTEGER[],
ADD COLUMN     "byMonthDay" INTEGER[];
