/*
  Warnings:

  - You are about to drop the `tournaments_has_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tournaments_has_tags" DROP CONSTRAINT "tournaments_has_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "tournaments_has_tags" DROP CONSTRAINT "tournaments_has_tags_tournamentId_fkey";

-- DropTable
DROP TABLE "tournaments_has_tags";

-- CreateTable
CREATE TABLE "_TournamentToTournamentTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TournamentToTournamentTag_AB_unique" ON "_TournamentToTournamentTag"("A", "B");

-- CreateIndex
CREATE INDEX "_TournamentToTournamentTag_B_index" ON "_TournamentToTournamentTag"("B");

-- AddForeignKey
ALTER TABLE "_TournamentToTournamentTag" ADD CONSTRAINT "_TournamentToTournamentTag_A_fkey" FOREIGN KEY ("A") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentToTournamentTag" ADD CONSTRAINT "_TournamentToTournamentTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tournament_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
