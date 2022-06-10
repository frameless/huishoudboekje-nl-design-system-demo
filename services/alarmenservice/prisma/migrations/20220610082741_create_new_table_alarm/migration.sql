-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "gebruikerEmail" TEXT NOT NULL,
    "afspraakId" INTEGER NOT NULL,
    "signaalId" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "datumMargin" INTEGER NOT NULL,
    "bedrag" DOUBLE PRECISION NOT NULL,
    "bedragMargin" DOUBLE PRECISION NOT NULL,
    "byDay" "DayOfWeek"[],
    "byMonth" INTEGER[],
    "byMonthDay" INTEGER[],
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);
