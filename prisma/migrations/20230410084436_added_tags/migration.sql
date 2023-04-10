/*
  Warnings:

  - You are about to drop the column `registration_date` on the `tournament_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `count_entries` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `prize_pool` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `tournament_category_id` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the `tournament_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tournaments" DROP CONSTRAINT "tournaments_tournament_category_id_fkey";

-- AlterTable
ALTER TABLE "tournament_registrations" DROP COLUMN "registration_date",
ADD COLUMN     "is_reentry" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "count_entries",
DROP COLUMN "prize_pool",
DROP COLUMN "tournament_category_id",
ADD COLUMN     "guaranteed_prize_pool" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verified_at" TIMESTAMP(0);

-- DropTable
DROP TABLE "tournament_categories";

-- CreateTable
CREATE TABLE "tournament_tags" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "tournament_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments_has_tags" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tournamentId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "tournaments_has_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tournament_tags_id_key" ON "tournament_tags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_has_tags_id_key" ON "tournaments_has_tags"("id");

-- AddForeignKey
ALTER TABLE "tournaments_has_tags" ADD CONSTRAINT "tournaments_has_tags_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments_has_tags" ADD CONSTRAINT "tournaments_has_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tournament_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
