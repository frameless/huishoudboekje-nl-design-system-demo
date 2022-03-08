-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "banktransactieIds" INT[],
    "isActive" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "actions" TEXT[],
    "context" JSONB NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);
