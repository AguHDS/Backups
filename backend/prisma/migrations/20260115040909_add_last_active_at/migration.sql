-- DropIndex
DROP INDEX `verification_identifier_idx` ON `verification`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `last_active_at` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `verification_identifier_idx` ON `verification`(`identifier`(191));
