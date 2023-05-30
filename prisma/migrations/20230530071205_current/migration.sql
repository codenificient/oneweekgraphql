/*
  Warnings:

  - You are about to drop the column `lineTotal` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitTotal` on the `CartItem` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `CartItem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `CartItem` DROP COLUMN `lineTotal`,
    DROP COLUMN `unitTotal`,
    MODIFY `price` DOUBLE NOT NULL;
