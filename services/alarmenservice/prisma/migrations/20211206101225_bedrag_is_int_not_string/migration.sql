/*
  Warnings:

  - You are about to drop the column `AlarmStatus` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `status` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `bedrag` on the `Alarm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bedragMargin` on the `Alarm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "AlarmStatus",
ADD COLUMN     "status" "AlarmStatus" NOT NULL,
DROP COLUMN "bedrag",
ADD COLUMN     "bedrag" INTEGER NOT NULL,
DROP COLUMN "bedragMargin",
ADD COLUMN     "bedragMargin" INTEGER NOT NULL;
