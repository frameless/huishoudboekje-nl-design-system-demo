/*
  Warnings:

  - You are about to drop the column `datum` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- Create temporary table
SELECT * FROM "Alarm" into "Alarm_tmp";

-- Alter Alarm table
ALTER TABLE "Alarm" DROP COLUMN "datum",
ADD COLUMN "endDate" TEXT,
ADD COLUMN "startDate" TEXT;

-- Migrate datum to startDate
UPDATE "Alarms"
 SET "startDate" = tmp.datum
 FROM "Alarms" AS a
 JOIN "Alarm_tmp" AS tmp ON tmp.id = a.id;

-- Add not null constraint to startDate
ALTER TABLE "Alarm" ALTER COLUMN "startDate" SET NOT NULL;

-- Delete temporary table
DROP TABLE "Alarm_tmp";