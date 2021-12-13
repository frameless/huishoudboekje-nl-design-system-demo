-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "AlarmSchema" (
    "id" TEXT NOT NULL,
    "byDay" "DayOfWeek"[],
    "byMonth" INTEGER[],
    "byMonthDay" INTEGER[],
    "repeatFrequency" TEXT,
    "exceptDates" TEXT[],
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,

    CONSTRAINT "AlarmSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "margin" TEXT NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "gebruikerEmail" TEXT NOT NULL,
    "schemaId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alarm_schemaId_key" ON "Alarm"("schemaId");

-- CreateIndex
CREATE UNIQUE INDEX "Alarm_ruleId_key" ON "Alarm"("ruleId");

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "AlarmSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
