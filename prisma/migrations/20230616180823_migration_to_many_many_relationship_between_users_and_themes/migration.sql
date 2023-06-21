/*
  Warnings:

  - You are about to drop the column `userId` on the `Theme` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ThemeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ThemeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Theme" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ThemeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "light" TEXT,
    "dark" TEXT,
    "corners_path" TEXT,
    "corners_fill" TEXT
);
INSERT INTO "new_Theme" ("corners_fill", "corners_path", "dark", "id", "light") SELECT "corners_fill", "corners_path", "dark", "id", "light" FROM "Theme";
DROP TABLE "Theme";
ALTER TABLE "new_Theme" RENAME TO "Theme";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ThemeToUser_AB_unique" ON "_ThemeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ThemeToUser_B_index" ON "_ThemeToUser"("B");
